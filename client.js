"use strict"
var debug = require('debug')('kafka-test-client')
var ioc = require('socket.io-client')
var opts = {
  reconnectionDelay: 200,
  reconnectionDelayMax: 2000,
  reconnectionAttempts: 100
}
var conn = ioc.connect('ws://localhost:3000',opts)

conn.on('connect',function(data){
  console.log('connected')
  conn.emit('test',{whatever:true},function(err,wat){
    console.log('res',err,wat)
  })
})

conn.on('connect_error',function(err,data){
  console.error('connect_error',err,data)
})

conn.on('connect_timeout',function(err,data){
  console.error('connect_timeout',err,data)
})

conn.on('reconnect',function(err,data){
  console.error('reconnect',err,data)
})

conn.on('reconnect_attempt',function(err,data){
  console.error('reconnect_attempt',err,data)
})

conn.on('reconnecting',function(err,data){
  console.error('reconnecting',err,data)
})

conn.on('reconnect_error',function(err,data){
  console.error('reconnect_error',err,data)
})

conn.on('reconnect_failed',function(err,data){
  console.error('reconnect_failed',err,data)
})


console.log('setup')
