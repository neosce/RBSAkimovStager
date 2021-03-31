package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	// Новый лог
	LogWriteAll("-------NEW LOG-------")

	// Запись время выполнения программы
	defer Un(Trace("go app"))
	
	pathUrl, pathData := getFlags()

	// Создадим новую суб-директорию в текущей рабочей папке.
	err := os.Mkdir(*pathData, 0755)
	if err != nil {
		LogWriteAll("FAIL create directory: " + *pathData)
	} else {
		LogWriteAll("Create directory: " + *pathData)
	}

	// Чтение файла
	file, err := os.Open(*pathUrl)
	if err != nil {
		LogWriteAll("FAIL read file: " + *pathData)
	} else {
		LogWriteAll("Read file: " + file.Name())
	}
	defer file.Close()

	// Получить срез urls из файла
	urls := GetFileReadLine(file)

	// Записать в файл
	for _, url := range urls {
		file, err := os.Create(filepath.Join(*pathData, deleteChar(url, "/") + ".html"))
		if err != nil {
			LogWriteAll("FAIL read file: " + *pathData)
		}
		defer file.Close()

		CurlWriteFile(file, url)
		LogWriteAll("Create file: " + file.Name())
	}
}

func getFlags() (*string, *string) {
	var (
		pathUrl  *string
		pathData *string
	)

	pathUrl = flag.String("u", "./url.txt", `Path to url file. Default: "./url.txt"`)
	pathData = flag.String("d", "./res/", `Path to result files. Default: "./res"`)

	flag.Parse()

	fmt.Printf("Path data files: %s\n", *pathData)
	fmt.Printf("Path url: %s\n", *pathUrl)

	return pathUrl, pathData
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

