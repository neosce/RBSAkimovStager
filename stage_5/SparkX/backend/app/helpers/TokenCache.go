package helpers

import (
	"backend/app/models/entities"
	"errors"
	"github.com/revel/revel"
	"sync"
	"time"
)

type session struct {
	cls  time.Time          // время закрытия сессии
	user *entities.Employee // ссылка на пользователя сессии
}

// sessionCloser тип объекта, который удаляет просроченные сессии
type sessionCloser struct {
	ci time.Duration // cleanup interval. периодичность очищения кэша
}

// cache тип кэша сессий пользователей
type cache struct {
	sync.Mutex
	sessions map[token]*session
}

// token тип токена
type token string

// ICache интерфейс кэша
type ICache interface {
	TokenIsActual(string) bool              // актуальность токена
	Get(string) (*entities.Employee, error) // Get получение данных кэша по токену
	Set(string, *entities.Employee) error   // Set установка данных кэша по токену
	Delete(string) error                    // Delete удаление данных кэша по токену
}

var (
	cacheUsers         *cache                                             // экземпляр кэша
	ErrSessionNotExist error         = errors.New("сессия не существует") // Ошибка поиска сессии
	ed                 time.Duration                                      // expiration default. время жизни сессии по умолчанию
)

// run метод запуска closer'а
func (sc *sessionCloser) run() {
	go func() {
		for {
			// ожидаем период времени
			<-time.After(sc.ci)

			// проверка всех сессий на просроченность
			for t, s := range cacheUsers.sessions {
				if time.Now().After(s.cls) {
					_ = cacheUsers.Delete(string(t))
				}
			}
		}
	}()
}

// GetCache получение экземпляра кэша
func GetCache() (c ICache, err error) {
	if cacheUsers == nil {
		cacheUsers = new(cache)
		cacheUsers.sessions = make(map[token]*session)

		// получение настройки времени жизни сессии по умолчанию
		if d, ok := revel.Config.Int("session.expirationDuration"); !ok {
			err = ErrFailedConnection
			revel.AppLog.Errorf("Не удалось получить время жизни сессии из файла конфигурации: %v\n", err)
			return nil, err
		} else {
			ed = time.Duration(d) * time.Second
		}

		// получение настройки переодичность очищения кэша
		if ci, ok := revel.Config.Int("session.cleanupInterval"); !ok {
			err = ErrFailedConnection
			revel.AppLog.Errorf("Не удалось получить время жизни сессии из файла конфигурации: %v\n", err)
			return nil, err
		} else {
			// запуск сборщика просроченных сессий
			sc := &sessionCloser{
				ci: time.Duration(ci) * time.Minute,
			}
			sc.run()
		}
	}

	return cacheUsers, nil
}

// TokenIsActual актуальность токена
func (c *cache) TokenIsActual(t string) (ok bool) {
	// блокировка кэша до завершения функции
	c.Lock()
	defer c.Unlock()

	if _, ok = c.sessions[token(t)]; ok {
		// обновление времени жизни сессии
		err := c.update(t)
		if err != nil {
			revel.AppLog.Errorf("cache.TokenIsActual : c.Update, %s\n", err)
			return false
		}
	}

	return
}

// Get получение данных кэша по токену
func (c *cache) Get(t string) (*entities.Employee, error) {
	// блокировка кэша до завершения функции
	c.Lock()
	defer c.Unlock()

	if _, ok := c.sessions[token(t)]; !ok {
		return nil, ErrSessionNotExist
	}

	// обновление времени жизни сессии
	err := c.update(t)
	if err != nil {
		return nil, err
	}

	return c.sessions[token(t)].user, nil
}

// Set установка данных кэша по токену
func (c *cache) Set(t string, u *entities.Employee) (err error) {
	// блокировка кэша до завершения функции
	c.Lock()
	defer c.Unlock()

	s := &session{
		cls:  time.Now().Add(time.Minute * ed),
		user: u,
	}
	c.sessions[token(t)] = s

	return
}

// Delete удаление данных кэша по токену
func (c *cache) Delete(t string) (err error) {
	// блокировка кэша до завершения функции
	c.Lock()
	defer c.Unlock()

	delete(c.sessions, token(t))

	return
}

// Delete удаление данных кэша по токену
func (c *cache) update(t string) (err error) {
	var (
		ok bool
		s  *session
	)

	if s, ok = c.sessions[token(t)]; !ok {
		return ErrSessionNotExist
	}

	s.cls = time.Now().Add(time.Minute * ed)

	return
}
