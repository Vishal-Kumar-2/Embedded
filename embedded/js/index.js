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

$(() => {
  setInterval(function() {
    $(".custom-social-proof").stop().slideToggle('slow', function() {
      $( "p.custom-notification-content" ).html(showAlternate());
    });
  }, 3000);
  $(".custom-close").click(function() {
    $(".custom-social-proof").stop().slideToggle('slow');
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
