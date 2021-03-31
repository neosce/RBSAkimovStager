package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"reflect"
	"time"
)

// Indication структура показания
type Indication struct {
	Indicator string    `json:"indicator"`
	Value     int       `json:"value"`
	Date      time.Time `json:"date"`
}

func main() {
	// чтение аргументов
	var datafile *string

	datafile = flag.String("datafile", "./indications.json", `Path to datafile. Default: "./indications.json"`)

	flag.Parse()

	log.Printf("Datafile: %s\n", *datafile)

	// открытие файла
	f, err := os.Open(*datafile)
	if err != nil {
		log.Printf("ERROR os.Open, %s\n", err)
		return
	}

	// преобразование в срез
	data, err := parseFile(f)
	if err != nil {
		log.Printf("ERROR parseFile, %s\n", err)
		return
	}

	// сортировка данных
	err = sortByDate(data)
	if err != nil {
		log.Printf("ERROR sortByDate, %s\n", err)
		return
	}

	// форматированный вывод
	print(data)
}

// преобразование файла в срез показаний приборов
func parseFile(file *os.File) (data []Indication, err error) {
	var (
		b []byte
	)

	// чтение содержимого файла
	b, err = ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	// преобразование из json в срез структур
	err = json.Unmarshal(b, &data)
	if err != nil {
		return nil, err
	}

	return
}

// функция сортировки данных по дате. Заменяет ссылку входного среза на отсортированный срез
func sortByDate(data []Indication) (err error) {
	var (
		sortedData []Indication
	)
	copy(sortedData, data)

	for i := 0; i < len(data); i++ {
		for j := 0; j < len(data)-1; j++ {
			timestamp := data[j].Date.Unix() // числовое представление даты (секунды с 1 января 1970 года). поле для сортировки
			timestamp2 := data[j+1].Date.Unix()

			if timestamp < timestamp2 {
				data[j], data[j+1] = data[j+1], data [j]
			}
		}
	}

	data = sortedData

	return
}

// функция форматированного вывода среза показаний
func print(data []Indication) {
	var (
		res   string
	)

	for a, i := range data {
		a++
		v := reflect.ValueOf(i)

		fmt.Println(a, ": ")
		for j := 0; j < v.NumField(); j++ {
			fmt.Printf("    %s: %v\n", v.Type().Field(j).Name, v.Field(j))
		}
		fmt.Println()
		/*res = fmt.Sprintf("%s", res)
		res = fmt.Sprintf("value: %v", i.Value) // поле "значение" показания прибора
		// TODO ...
		res = fmt.Sprintf("\n")*/
	}

	log.Printf(res)
}
