export default class InAudio {

  static scrollMainSound() {
    new Audio(window.media.scrollMain).play();
  }

  static scrollRatingSound() {
    new Audio(window.media.scrollRating).play();
  }

  static scrollFeeds() {
    new Audio(window.media.feed).play();
  }
}
