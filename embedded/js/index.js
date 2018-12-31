var count = 400;
var widget = document.createElement('section'); // is a node
const modals = ['liveNowModal', 'totalCountModal', 'recentlySigned'];
let contentIndex = 0;

const getInnerHTML = (modal, name = '', city = '') => {
  const modalHTML = {
    liveNowModal: {
      image: 'https://static1.squarespace.com/static/525dcddce4b03a9509e033ab/t/526800ffe4b0ee2599668050/1382547712599/fire.png',
      msg: `<b class='count'> ${count} </b> people  are visiting <br>this page right now. <br>`,
    },
    totalCountModal: {
      image: 'https://tidings.today/wp-content/uploads/2018/08/tidings-today-smartphones-1-768x576.jpg',
      msg: `<b class='count'> ${count} has visited this site. <br>`,
    },
    recentlySigned: {
      image: 'https://tidings.today/wp-content/uploads/2018/08/tidings-today-logo-fav.png',
      msg: `<b> ${name} from ${city} </b>signed up <br>this page right now.</br>`,
    },
  }
  return getModalHTML(modalHTML[modal])
}

const getModalHTML = (customData = {}) => `
  <div class="custom-notification-image-wrapper">
    <img src="${customData.image}">
  </div>
  <div class="custom-notification-content-wrapper">
    <p class="custom-notification-content">
      ${customData.msg} <strong class="verify"><i class="fa fa-check-circle"></i> verified by Enkode </strong>
    </p>
  </div>`;

// call common function for variable parameters
widget.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <section class="custom-social-proof" >
    <div class="custom-notification">
      <div class="custom-notification-container">
        ${getInnerHTML('liveNowModal')}
      </div>
      <div class="custom-close"><i class="fa fa-times-circle-o"></i>
      </div>
    </div>
  </section>
`;

const positions = {
  topLeft: {
    'top': '8px',
    'left': '16px',
  },
  topRight: {
    'top': '8px',
    'right': '16px',
  },
  bottomRight: {
    'bottom': '20px',
    'right': '20px',
  },
  bottomLeft: {
    'bottom': '20px',
    'left': '20px',
  }
}

const changePosition = (position) => {
  return $('.custom-social-proof').css(positions[position]);
}

$(() => {
  let $form = $('body');
  let $submitActors = $form.find('input[type=submit]');
  let targetLinks = ['/home/rails/work/embedded/embedded/example.html'];

  $form.append(widget);
  changePosition('bottomRight');

  setInterval(function() {
    $(".custom-social-proof").stop().slideToggle('slow')
    contentIndex++;
    contentIndex = contentIndex === modals.length ? 0 : contentIndex;
    $(".custom-notification-container").html(getInnerHTML(modals[contentIndex]));
  }, 5000);

  $(".custom-close").click(() => {
    $(".custom-social-proof").stop().slideToggle('slow');
  });

  $submitActors.click((event) => {
    if(targetLinks.includes(location.pathname)) {
     event.preventDefault();
     count = count + 1;
     $(".custom-notification-container" ).html(getInnerHTML('recentlySigned', event.target.value, 'California')).delay(5000);
    }
  });

  // remaining code
  //   to count the number of visitors to website    API to record number of visitors
  // using nodejs request object or express, req.ip
  // $( window ).on( "load", function() {
  //   createBackend();
  // });
})
