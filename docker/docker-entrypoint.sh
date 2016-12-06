#!/bin/sh

ARG="${@:-kafka}"

kafka(){
  exec /kafka/bin/kafka-server-start.sh config/server.properties
}

zookeeper(){
  exec /kafka/bin/zookeeper-server-start.sh config/zookeeper.properties
}

setup(){
  sleep 1
  if [ -n "$KAFKA_TOPIC" ]; then 
    echo "setting up [$KAFKA_TOPIC]"
    /kafka/bin/kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic "$KAFKA_TOPIC"
  fi
}

$ARG
exit $?

