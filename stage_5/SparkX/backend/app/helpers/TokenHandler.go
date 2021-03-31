package helpers

import (
	"crypto/rand"
	b64 "encoding/base64"
	"fmt"
	"github.com/revel/revel"
	"net/http"
)

// GetToken функция получения токена
func GetToken(c *revel.Controller) (string, error) {
	// получение токена клиента
	token, err := c.Request.Cookie("auth-token")
	if err != nil {
		if err == http.ErrNoCookie {
			return "", nil
		}

		revel.AppLog.Errorf("helpers.GetToken : c.Request.Cookie, %s\n", err)
		return "", err
	}

	return token.GetValue(), nil
}

func GenerateToken() (string, error) {
	c := 50
	b := make([]byte, c)

	// Теперь срез должен содержать случайные байты, а не только нули.
	_, err := rand.Read(b)
	if err != nil {
		fmt.Println("error:", err)
		return "", err
	}

	// кодируем срез байтов в строку base64
	sEnc := b64.StdEncoding.EncodeToString(b)

	return sEnc, nil
}
