package main

import (
	"io"
	"log"
	"os"
	"time"
)

func Trace() time.Time {
	log.Println("START:")
	var time = time.Now()

	log.Println(time.Format("2006-01-02 15:04:05"))

	return time
}

func Un(startTime time.Time) {
	endTime := time.Now()
	var totalTime = endTime.Sub(startTime)

	log.Println("  END:", time.Now().Format("2006-01-02 15:04:05"), "ElapsedTime in seconds:", totalTime)

	log.Println(totalTime.String())
}

func SetOutputFile(pathLog *string) {
	file, err := os.OpenFile(*pathLog, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}

	mw := io.MultiWriter(os.Stdout, file)
	log.SetOutput(mw)
}