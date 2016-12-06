"use strict";

const Promise     = require('bluebird')
const kafka       = Promise.promisifyAll(require('kafka-node'))
const Producer    = Promise.promisifyAll( kafka.Producer )
const client      = new kafka.Client('10.8.8.8:2181')
//const consumer    = new kafka.Consumer(client)


class Recieve {

  constructor(topic, partition) {
    this.recieveCount = 0
    this.recieveTimerCount = 0
    this.consumer = new kafka.Consumer(
      client,
      //[{ topic: 'topic1', partition: 0 }, { topic: 'topic2', partition: 0 }],
      [{ topic: topic, partition: partition }],
      {autoCommit: false}
    )
    this.eventSetup();
  }

  eventSetup(){
    this.consumer.on('error', this.onError)
    this.consumer.on('message', msg => this.onMessage.call(this, msg) )

    setInterval(() => {
      let diff = this.recieveCount - this.recieveTimerCount
      console.log('timer 10 count:%s m/s:%s', diff, diff/10)
      this.recieveTimerCount = this.recieveCount
    }, 10000)
  }

  onMessage(message) {
    this.recieveCount++;
    if ( this.recieveCount % 5000 === 0 )
      console.log('recieved', this.recieveCount, JSON.stringify(message));
  }

  onError(err) {
    console.error('error', err)
  }

}


class Create {

  constructor(topic, partition) {

    this.producer = new Producer(client);

    this.createCount = 0;

    this.km = new kafka.KeyedMessage('key', 'message');

    this.payloads = [
      { 
        topic: 'my-test-topic', 
        messages: [
          'hi this is a asdf asdf asdf asdf asdf asdf slightly longer message for topic 1 that should take up some more room',
          'dspfijjjados;fjas;kfmkals;mfk;lsadmf;laksmf;aslkdmf;alsdkfmd;alskfmas;dfkewpkfpewkpokpgkfds;lgmkfldsmg.dfnn.gfdngdsgnfdslgndslfgdsf'
        ],
        partition: 0 
      },
      { 
        topic: 'topic2',
        messages: ['hello', this.km] 
      }
    ];

    this.eventSetup();
  }

  eventSetup () {
    this.producer.on('ready', msg => this.produce() )
    this.producer.on('error', err => console.error('error', err) )
  }

  produce () {
    console.log('ready', this.createCount)
    console.log('next tick')
    return this.producer.sendAsync(this.payloads)
      .then(data => {
        console.log('data', data)
        this.createCount++
        if ( this.createCount % 1000 === 0 )
          console.log('created', this.createCount, data)
        this.produce()
      })
      .catch(err => console.error(err))
  }

}


if ( process.argv[2] === undefined || process.argv[2] === 'recieve' )
  let recieve = new Recieve('my-test-topic', 0)


if ( process.argv[2] === undefined || process.argv[2] === 'create' )
  let create = new Create('my-test-topic', 0)



module.exports = {
  Create:   Create,
  Recieve:  Recieve,
  kafka:    kafka,
  client:   client
}
