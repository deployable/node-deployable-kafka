"use strict"
var debug = require('debug')('kafka-test')
var _ = require('lodash')
var port = process.env.KAFKA_TEST_PORT || 3000
var sendCount = 0

var io = require('socket.io')(port)
var kafka = require('socket.io-kafka')

io.adapter(kafka('localhost:2821/'))

io.on('connection', function(socket){
  console.log('connection', socket.id,socket.handshake.address, _.keys(socket))
  socket.on('error', function(err){
    console.error('error', err)
  })
  socket.on('disconnect', function(data){
    console.error('disconnect', data)
  })
  socket.on('test', function(data, cb){
    console.log('test data', data)
    sendCount -= 1
    if (sendCount > 0) console.error("%s sendCount is high: %s", Date.now(), sendCount)
    if (cb) cb(null, 'test ran')
  })
})


setInterval(function(){
  sendCount += 1
  io.emit('test', 'ping:'+port);
},200)
