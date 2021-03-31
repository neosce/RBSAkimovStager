package main

import (
	"fmt"
	"log"
	"os"
	"time"
)

func Trace(s string) (string, time.Time) {
	log.Println("START:", s)
	var time = time.Now()

	LogWriteFile(time.String())

	return s, time
}

func Un(s string, startTime time.Time) {
	endTime := time.Now()
	var totalTime = endTime.Sub(startTime)

	log.Println("  END:", s, "ElapsedTime in seconds:", totalTime)

	LogWriteFile(totalTime.String())
}

func LogWriteFile(log string) {
	file, err := os.OpenFile("logs.txt", os.O_APPEND|os.O_WRONLY, 0600)

	if err != nil {
		panic(err)
	}

	defer file.Close()

	fmt.Fprintln(file, log)
}

func LogWriteTerminal(logString string) {
	log.Println(logString)
}

func LogWriteAll(log string) {
	LogWriteTerminal(log)
	LogWriteFile(log)
}
