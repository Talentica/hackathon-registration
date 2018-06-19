import React, { Component } from "react";
import windowDimensions from "react-window-dimensions";
import classnames from "classnames";

import "./Cover.css";
const mp4VideoPath =
  "https://storage.googleapis.com/coverr-main/mp4/Love-Coding.mp4";
const webmVideoPath =
  "https://storage.googleapis.com/coverr-main/webm/Love-Coding.webm";
const posterPath =
  "https://storage.googleapis.com/coverr-public/poster/Love-Coding.jpg";

class Cover extends Component {
  constructor(props) {
    super(props);
    this.state = { coverImg: {}, window: {} };
    this.coverImg = React.createRef();
    this.coverFilter = React.createRef();
    this.coverVideo = React.createRef();
    this.heroModule = React.createRef();

    this.scaleCover = this.scaleCover.bind(this);
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  componentDidMount() {
    this.scaleVideoContainer();
    window.addEventListener("resize", this.scaleCover, false);
    this.coverVideo.current.setAttribute("muted", "true");
    this.initBannerVideoSize(this.coverImg);
    this.initBannerVideoSize(this.coverFilter);
    this.initBannerVideoSize(this.coverVideo);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.scaleCover, false);
  }
  static getDerivedStateFromProps(props, state) {
    let newState = { ...state };
    if (
      props.width !== state.window.width ||
      props.height !== state.window.height
    ) {
      newState.window.width = props.width;
      newState.window.height = props.height;
      return newState;
    }

    return null;
  }

  onImgLoad({ target: img }) {
    this.setState({
      coverImg: {
        height: img.offsetHeight,
        width: img.offsetWidth
      }
    });
  }
  initBannerVideoSize(element) {
    element.current.setAttribute("data-height", element.current.offsetHeight);
    element.current.setAttribute("data-width", element.current.offsetWidth);

    this.scaleBannerVideoSize(element);
  }

  scaleBannerVideoSize(element) {
    const { width: windowWidth, height: windowHeight } = this.state.window;

    let videoWidth, marginLeft, videoHeight;
    // console.log(windowHeight);

    const videoAspectRatio =
      element.current.getAttribute("data-height") /
      element.current.getAttribute("data-width");

    element.current.style.width = windowWidth + "px";

    if (windowWidth < 1000) {
      videoHeight = windowHeight;
      videoWidth = videoHeight / videoAspectRatio;
      marginLeft = -(videoWidth - windowWidth) / 2 + "px";
      element.current.setAttribute(
        "style",
        `height:${videoHeight}px; width:${videoWidth}px; margin-top:0; margin-left:${marginLeft}`
      );
    }

    this.coverVideo.current.classList.add(["fadeIn", "animated"]);
  }
  scaleCover() {
    this.scaleVideoContainer();
    this.scaleBannerVideoSize(this.coverImg);
    this.scaleBannerVideoSize(this.coverFilter);
    this.scaleBannerVideoSize(this.coverVideo);
  }
  scaleVideoContainer() {
    var height = window.innerHeight + 5;
    this.heroModule.current.setAttribute("style", `height:${height}px;`);
  }

  render() {
    const { children } = this.props;
    return (
      <div
        ref={this.heroModule}
        className={classnames("homepage-hero-module", "jumbotron")}
      >
        <div className="video-container">
          <div className={classnames("title-container")}>{children}</div>
          <div ref={this.coverFilter} className="filter" />
          <video
            ref={this.coverVideo}
            autoPlay
            onLoad={({ target: video }) => console.log(video)}
            loop
            muted="true"
            className="fillWidth"
            preload="auto"
          >
            <source src={mp4VideoPath} type="video/mp4" />Your browser does not
            support the video tag. I suggest you upgrade your browser.
            <source src={webmVideoPath} type="video/webm" />Your browser does
            not support the video tag. I suggest you upgrade your browser.
          </video>
          <div className="poster hidden">
            <img
              ref={this.coverImg}
              src={posterPath}
              alt=""
              onLoad={this.onImgLoad}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default windowDimensions()(Cover);
