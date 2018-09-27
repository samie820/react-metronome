import React, { Component } from "react";
import click1 from "./click1.wav";
import click2 from "./click2.wav";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      bpm: 50,
      beatsPerMeasure: 4,
      count: 0
    };

    this.click1 = new Audio(click1);
    this.click2 = new Audio(click2);
  }

  handleSliderChange = event => {
    // sets state for the BPM and also calls the function that starts the metronome with the requirement BPM
    const bpm = event.target.value;
    this.setState(
      {
        bpm
      },
      () => {
        if (this.state.playing) {
          // only call this function if the metronome is already running
          this.startMetronome();
        }
      }
    );
  };

  componentWillUnmount() {
    // just to prevent memory leak
    clearInterval(this.timer);
  }

  playOrPause = () => {
    const { playing } = this.state;
    if (playing) {
      //stop the timer
      clearInterval(this.timer);
      this.setState({
        playing: false
      });
    } else {
      // start the timer with the current BPM
      this.startMetronome();
      this.setState(
        {
          count: 0,
          playing: true
        },
        this.playClick
      );
    }
  };

  startMetronome = () => {
    if (this.timer) {
      // checks if the timer already exists and then clears it before creating a new one
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
  };

  playClick = () => {
    // Just to alternate between the two loaded sounds based on the current Measure
    const { count, beatsPerMeasure } = this.state;

    if (count % beatsPerMeasure === 0) {
      this.click1.play();
    } else {
      this.click2.play();
    }

    this.setState(prevState => ({
      count: (prevState.count + 1) % prevState.beatsPerMeasure
    }));
  };

  render() {
    const { bpm, playing } = this.state;
    return (
      <div className="metronome">
        <div className="bpm-slider">
          <div>{bpm} BPM</div>
          <input
            type="range"
            min="50"
            max="250"
            value={bpm}
            onChange={this.handleSliderChange}
          />
        </div>
        <button type="button" role="button" onClick={this.playOrPause}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    );
  }
}

export default App;
