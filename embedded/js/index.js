const $form = $('body');
const $submitActors = $form.find('input[type=submit]');
const widget = document.createElement('section'); // is a node
let contentIndex = 0;
let totalSigned = 0; //to change content of pop ups

const getModalHTML = (customData = {}) => `
  <div class="custom-notification-image-wrapper">
    <img src="${customData.image}">
  </div>
  <div class="custom-notification-content-wrapper">
    <p class="custom-notification-content">
      ${customData.msg} <strong class="verify"><img src='check-circle.png'> verified by Enkode </strong>
    </p>
  </div>`;

const getBackendData = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      dataType: 'json',
      url: 'http://localhost:5000/customize/def',
      crossDomain: true,
      success: resolve,
      error: reject,
    });
  })
}
const positions = {
  topLeft: {
    'top': '20px',
    'left': '20px',
  },
  topRight: {
    'top': '20px',
    'right': '20px',
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

const addWidget = (res) => {
  customize = !res ? customize : res;
  widget.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="css/index.css"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <section id="social_proof" class="custom-social-proof">
      <div class="custom-notification">
        <div class="custom-notification-container">
          ${getInnerHTML(customize.initialCard)}
        </div>
        <div class="custom-close"><i class="fa fa-times-circle-o"></i>
        </div>
      </div>
    </section>
  `;
  $form.append(widget);
  changePosition(customize.appearFrom);
}

$(() => {
  addWidget();
  setInterval(function() {
    $(".custom-social-proof").stop().toggle('slide', { direction: customize.direction || 'down' }, function() {
      if ($(this).is(':hidden')) {
        contentIndex++;
        contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
        $(".custom-notification-container").html(getInnerHTML(customize.supportedCards[contentIndex]));
      }
    })
  }, 2000);

  $(".custom-close").click(function() {
    $(".custom-social-proof").stop().slideToggle('slow');
  });

  //code to record submit actions
  $submitActors.click((event) => {
    if(targetLinks.includes(location.pathname)) {
     event.preventDefault();
     totalSigned = totalSigned + 1;
     $(".custom-notification-container" ).html(getInnerHTML('totalSigned')).delay(5000);
    }
  });
})


function showContent(code, param1 = '', param2 = '') {
  switch (code) {
    case 0:
      return `<b> ${param1} from ${param2} </b> recently signed Up. <br><strong class="verify">verified by Enkode </strong></p>`;
    case 1:
      return `<b> 444 people </b> are visiting <br>this page right now. <br><strong class="verify">verified by Enkode </strong>`
    default:
      return `9000 people has visited this page`;
  }
}

//function to randomly show different pop-up messages
function showAlternate() {
  let array = [0,1,2]
  let number = array[Math.floor(Math.random() * array.length)];
  return showContent(number);
}
