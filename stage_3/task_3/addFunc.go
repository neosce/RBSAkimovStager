package main

import (
	"bufio"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"
)

// Получить срез urls из файла
func GetFileReadLine(file *os.File) []string {
	var urls []string
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		urls = append(urls, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Println("Err get url in file: " + file.Name())
		panic(err)
	}
	log.Println("Get url in file: " + file.Name())

	return urls
}

// Получить html по запросу
func CurlWriteFile(file string, Url string, curlWriteFileErr chan error, wg *sync.WaitGroup) error {
	defer wg.Done()

	resp, err := http.Get(Url)
	if err != nil {
		log.Println(err)
		curlWriteFileErr <- err
		return err
	}

	log.Println("Get http StatusCode: " + resp.Status)
	log.Println("Content length: " + strconv.Itoa(int(resp.ContentLength)))

	defer resp.Body.Close()

	bs, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		curlWriteFileErr <- err
		return err
	}

	err = ioutil.WriteFile(file, bs, os.ModePerm)
	if err != nil {
		log.Println(err)
		curlWriteFileErr <- err
		return err
	}

	curlWriteFileErr <- nil
	return nil
}
