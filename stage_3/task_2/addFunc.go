package main

import (
	"bufio"
	"fmt"
	"net/http"
	"os"
	"strconv"
)

// Получить срез urls из файла
func GetFileReadLine(file *os.File) []string {
	var urls []string
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		urls = append(urls, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		LogWriteAll("Err get url in file: " + file.Name())
		panic(err)
	}
	LogWriteAll("Get url in file: " + file.Name())

	return urls
}

// Получить html по запросу
func CurlWriteFile(file *os.File, Url string) {
	resp, err := http.Get(Url)
	if err != nil {
		LogWriteAll("Get http StatusCode: " + resp.Status)
		panic(err)
	}
	LogWriteAll("Get http StatusCode: " + resp.Status)
	LogWriteAll("Get http StatusCode: " + strconv.Itoa(int(resp.ContentLength)))

	defer resp.Body.Close()

	for true {
		bs := make([]byte, 1024)
		n, err := resp.Body.Read(bs)
		_, _ = fmt.Fprint(file, string(bs[:n]))

		if n == 0 || err != nil {
			break
		}
	}

	LogWriteAll("Curl write: " + file.Name())
}
