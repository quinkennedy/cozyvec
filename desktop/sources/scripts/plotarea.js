'use strict'

function PlotArea(client) {
  this.el = document.createElement('canvas')
  this.el.id = 'plotarea'
  // this._paper = document.createElement('canvas')
  // this._paper.id = 'paper'

  this.install = function(host) {
    // this.el.appendChild(this._paper)
    host.appendChild(this.el)
  }

  this.start = function() {
    // this._input.focus()
  }
}
