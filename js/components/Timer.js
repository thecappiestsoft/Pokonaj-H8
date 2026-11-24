/* Timer – wspólny komponent oparty na znacznikach czasu (nie na liczbie wywołań setInterval).
   Pauza zatrzymuje naliczanie; po powrocie karty czas jest przeliczany z Date.now(). */
(function (PH8) {
  'use strict';

  function Timer(opts) {
    opts = opts || {};
    this.duration = opts.duration || 0;
    this.countUp = !!opts.countUp;
    this.onTick = opts.onTick || null;
    this.onEnd = opts.onEnd || null;
    this.interval = opts.interval || 250;
    this.elapsedBefore = 0;
    this.startedAt = 0;
    this.handle = null;
    this.state = 'idle';
  }

  Timer.prototype.start = function () {
    this.elapsedBefore = 0;
    this.startedAt = Date.now();
    this.state = 'running';
    this._loop();
    this._tick();
    return this;
  };
  Timer.prototype._loop = function () {
    clearInterval(this.handle);
    this.handle = setInterval(() => this._tick(), this.interval);
  };
  Timer.prototype.getElapsed = function () {
    return this.elapsedBefore + (this.state === 'running' ? Date.now() - this.startedAt : 0);
  };
  Timer.prototype.getRemaining = function () {
    return Math.max(0, this.duration - this.getElapsed());
  };
  Timer.prototype._tick = function () {
    if (this.state !== 'running') return;
    const value = this.countUp ? this.getElapsed() : this.getRemaining();
    if (this.onTick) this.onTick(value);
    if (!this.countUp && this.getRemaining() <= 0) {
      this.stop();
      this.state = 'ended';
      if (this.onEnd) this.onEnd();
    }
  };
  Timer.prototype.pause = function () {
    if (this.state !== 'running') return;
    this.elapsedBefore += Date.now() - this.startedAt;
    this.state = 'paused';
    clearInterval(this.handle);
  };
  Timer.prototype.resume = function () {
    if (this.state !== 'paused') return;
    this.startedAt = Date.now();
    this.state = 'running';
    this._loop();
    this._tick();
  };
  Timer.prototype.stop = function () {
    if (this.state === 'running') this.elapsedBefore += Date.now() - this.startedAt;
    clearInterval(this.handle);
    this.handle = null;
    if (this.state !== 'ended') this.state = 'stopped';
  };
  Timer.prototype.isRunning = function () { return this.state === 'running'; };
  Timer.prototype.isActive = function () { return this.state === 'running' || this.state === 'paused'; };

  PH8.components.Timer = Timer;
})(window.PH8);
