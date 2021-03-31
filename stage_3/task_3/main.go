package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
)

func main() {
	pathUrl, pathData, pathLog := getFlags()
	SetOutputFile(pathLog)

	// Новый лог
	log.Println("-------NEW LOG-------")

	// Запись время выполнения программы
	defer Un(Trace())

	var wg sync.WaitGroup
	curlWriteFileErr := make(chan error)

	// Создадим новую суб-директорию в текущей рабочей папке.
	err := os.Mkdir(*pathData, 0755)
	if err != nil {
		log.Println("FAIL create directory: " + *pathData)
	} else {
		log.Println("Create directory: " + *pathData)
	}

	// Чтение файла
	file, err := os.Open(*pathUrl)
	if err != nil {
		log.Println("FAIL read file: " + *pathData)
	} else {
		log.Println("Read file: " + file.Name())
	}
	defer file.Close()

	// Получить срез urls из файла
	urls := GetFileReadLine(file)

	// Записать в файл
	for _, url := range urls {
		wg.Add(1)
		go CurlWriteFile(filepath.Join(*pathData, deleteChar(url, "/") + ".html"), url, curlWriteFileErr, &wg)
		if <-curlWriteFileErr != nil {
			fmt.Println(<-curlWriteFileErr)
			continue
		}
		log.Println("Create file: " + file.Name())
	}
	wg.Wait() // ожидаем завершения горутин
}

func getFlags() (*string, *string, *string) {
	var (
		pathUrl  *string
		pathData *string
		pathLog * string
	)

	pathUrl = flag.String("u", "./url.txt", `Path to url file. Default: "./url.txt"`)
	pathData = flag.String("d", "./res/", `Path to result files. Default: "./res"`)
	pathLog = flag.String("l", "./logs.txt", `Path to logs file. Default: "./logs.txt"`)

	flag.Parse()

	log.Printf("Path data files: %s\n", *pathData)
	log.Printf("Path url: %s\n", *pathUrl)
	log.Printf("Path url: %s\n", *pathLog)

	return pathUrl, pathData, pathLog
}

// Убиарет все вхождения указанного символа в строку и возвращает новую строку
func deleteChar(str string, char string) string {
	var newString string

	for i:=0; i<len(str); i++ {
		if string(str[i]) != char {
			newString += string(str[i])
		}
	}

	return newString
}
