export default function animateScroll() {
  let currentStart = 0, current = 0;

  const animateScroll = (() => {
    current += 1;
    document.body.scrollTop = 100 - 10 * current;
    document.documentElement.scrollTop = 100 - 10 * current;
    if(current < 10) {
      setTimeout(animateScroll, 5);
    } else {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  });

  const animateScrollStart = (() => {
    currentStart += 1;
    document.body.scrollTop = window.pageYOffset - 10 * currentStart;
    document.documentElement.scrollTop = window.pageYOffset - 10 * currentStart;
    if(currentStart < 10) {
      setTimeout(animateScrollStart, 10);
    } else {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      animateScroll();
    }
  });

  const anotherScroll = (() => {
    current += 1;
    document.body.scrollTop = window.pageYOffset - 10 * current;
    document.documentElement.scrollTop = window.pageYOffset - 10 * current;
    if(window.pageYOffset > 10) {
      setTimeout(animateScroll, 5);
    } else {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  });

  if(window.pageYOffset > 200) {
    animateScrollStart();
  } else {
    anotherScroll();
  }
}
