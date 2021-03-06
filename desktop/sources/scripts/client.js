 'use strict'

function Client() {
  this.el = document.createElement('div')
  this.el.id = 'cozyvec'

  this.acels = new Acels(this)
  this.codearea = new CodeArea(this)
  this.plotarea = new PlotArea(this)
  this.source = new Source(this)
  this.api = new Api(this)
  this.papersizes = new PaperSizes()

  this.bindings = {}

  this.install = function(host = document.body) {
    this._wrapper = document.createElement('div')
    this._wrapper.id = 'wrapper'

    this.codearea.install(this._wrapper)
    this.plotarea.install(this._wrapper)
    this.el.appendChild(this._wrapper)
    host.appendChild(this.el)

    this.acels.set('File', 'New', 'CmdOrCtrl+N', () => { this.source.new(); this.plotarea.reset(); this.codearea.clear() })
    this.acels.set('File', 'Save', 'CmdOrCtrl+S', () => { this.source.write('cozyvec', 'js', this.codearea._input.value, 'text/plain') })
    this.acels.set('File', 'Export SVG', 'CmdOrCtrl+E', () => { this.source.write('cozyvec', 'svg', this.plotarea.getSvg(), 'image/svg+xml') })
    this.acels.set('File', 'Export PNG', 'CmdOrCtrl+I', () => { this.source.write('cozyvec', 'png', this.plotarea.el.toDataURL('image/png', 1.0), 'image/png') })
    this.acels.set('File', 'Open', 'CmdOrCtrl+O', () => { this.source.open('js', this.whenOpen) })
    this.acels.set('File', 'Export Gcode', 'CmdOrCtrl+J', () => { this.source.write('cozyvec', 'gcode', this.plotarea.getGcode(), 'text/plain') })
    this.acels.set('File', 'Export Zip', 'CmdOrCtrl+K', () => {
      const t = this.source.timestamp()
        const zip = new JSZip()
        zip.file(t+'.svg', this.plotarea.getSvg())
        //zip.file(t+' render.png', this.plotarea.el.toDataURL('image/png', 1.0))
        this.plotarea.el.toBlob(b => {
          zip.file(t+'.png', b)
          zip.file(t+'.gcode', this.plotarea.getGcode())
          zip.file(t+'.txt', this.codearea._input.value)
          zip.generateAsync({type:'blob'})
            .then( z => {this.source.write('cozyvec', 'zip',z,'blob')})
        }, 'image/png', 1.0)
    })

    this.acels.add('Edit', 'undo')
    this.acels.add('Edit', 'redo')
    this.acels.add('Edit', 'cut')
    this.acels.add('Edit', 'copy')
    this.acels.add('Edit', 'paste')
    this.acels.add('Edit', 'selectAll')

    this.acels.set('Project', 'Run', 'CmdOrCtrl+R', () => { this.codearea.run() })

    this.acels.addTemplate(this.papersizes.buildMenuTemplate((dims, name) => this.plotarea.resize(dims, name)))

    this.acels.addTemplate({
      label: "Pen Size",
      submenu: ['0.1','0.13','0.18','0.2','0.25','0.35','0.3','0.35','0.4','0.5','0.6','0.7','0.8','1.0','1.4','2.0'].map(size => {return {
        label: size, click: () => this.plotarea.penWidth(parseFloat(size))
      }})
    })

    this.acels.set('Orientation', 'Toggle Orientation', 'CmdOrCtrl+P', () => this.plotarea.orientationToggle())

    this.acels.install(window)
    this.acels.pipe(this)
  }

  this.start = function() {
    this.codearea.start()
    this.plotarea.start()
  }

  this.whenOpen = (file, res) => {
    console.log(file, res)
    this.codearea.load(res)
  }

  this.bind = (event, fn) => {
    this.bindings[event] = fn
  }

  this.onKeyPress = (e, id = 'key-press') => {
    if (this.bindings[id]) {
      this.bindings[id](e)
    }
  }

  this.onKeyDown = (e, id = 'key-down') => {
    if (this.bindings[id]) {
      this.bindings[id](e)
    }
  }

  this.onKeyUp = (e, id = 'key-up') => {
    if (this.bindings[id]) {
      this.bindings[id](e)
    }
  }

  this.message = (txt) => {
    this.codearea.setLog(txt)
  }

  this.run = (txt) => {
    this.codearea.setLog()
    this.api.run(txt)
  }
}
