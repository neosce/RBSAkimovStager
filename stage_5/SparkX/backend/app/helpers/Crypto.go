package helpers

import (
	"github.com/revel/revel"
	"golang.org/x/crypto/bcrypt"
)

// Получения хэша пароля
func GetHash(password string) string {
	// шифрация пароля
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		revel.AppLog.Errorf("Не удалось получить хэш пароля: %v\n", err)
	}

	return string(passwordHash)
}

// Проверка хэша пароля
func CompareHash(hashedPassword string, password string) bool {
	// Сравнение пароля с хешем
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		revel.AppLog.Errorf("Не удалось сравнить хэш пароля: %v\n", err)
		return false
	}

	return true
}
