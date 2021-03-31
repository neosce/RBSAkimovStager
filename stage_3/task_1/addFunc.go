package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

// Получить срез urls из файла
func GetFileReadLine(file *os.File) []string {
	var urls []string
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		urls = append(urls, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}

	return urls
}

// Получить html по запросу
func CurlWriteFile(file string, Url string) error {
	resp, err := http.Get(Url)
	if err != nil {
		fmt.Println(err)
		return err
	}

	defer resp.Body.Close()

	bs, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return err
	}

	err = ioutil.WriteFile(file, bs, os.ModePerm)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}
