'use strict'

function Source (client) {
  this.cache = {}

  this.install = () => {
  }

  this.start = () => {
    this.new()
  }

  this.new = () => {
    console.log('Source', 'New file..')
    this.cache = {}
  }

  this.open = (ext, callback) => {
    console.log('Source', 'Open file..')
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file.name.indexOf('.' + ext) < 0) { console.warn('Source', `Skipped ${file.name}`); return }
      this.read(file, callback)
    }
    input.click()
  }

  this.load = (ext, callback) => {
    console.log('Source', 'Load files..')
    const input = document.createElement('input')
    input.type = 'file'
    input.setAttribute('multiple', 'multiple')
    input.onchange = (e) => {
      for (const file of e.target.files) {
        if (file.name.indexOf('.' + ext) < 0) { console.warn('Source', `Skipped ${file.name}`); return }
        this.read(file, this.store)
      }
    }
    input.click()
  }

  this.store = (file, content) => {
    console.info('Source', 'Stored ' + file.name)
    this.cache[file.name] = content
  }

  this.save = (name, content, type = 'text/plain', callback) => {
    this.saveAs(name, content, type, callback)
  }

  this.saveAs = (name, ext, content, type = 'text/plain', callback) => {
    console.log('Source', 'Save new file..')
    this.write(name, ext, content, type, callback)
  }

  // I/O

  this.read = (file, callback) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const res = event.target.result
      if (callback) { callback(file, res) }
    }
    reader.readAsText(file, 'UTF-8')
  }

  this.write = (name, ext, content, type, settings = 'charset=utf-8') => {
    const link = document.createElement('a')
    const filename = `${(name ? (name+'-') : '')}${this.timestamp()}.${ext}`
    link.setAttribute('download', filename)
    if (type === 'image/png' || type === 'image/jpeg') {
      link.setAttribute('href', content)
    } else {
      const blob = (type === 'blob' ? content : dataURItoBlob(content, type))
      link.setAttribute('href', URL.createObjectURL(blob))
    }
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
  }

  this.timestamp = () => {
    const d = new Date()
    const Y = d.getFullYear()
    const M = ('0'+(d.getMonth()+1)).slice(-2)
    const D = ('0'+d.getDate()).slice(-2)
    const H = ('0'+d.getHours()).slice(-2)
    const m = ('0'+d.getMinutes()).slice(-2)
    const s = ('0'+d.getSeconds()).slice(-2)
    return `${Y}-${M}-${D} at ${H}.${m}.${s}`
  }

  function dataURItoBlob(data,mimeString) {
    var byteString = data//atob(data);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});

  }
}
