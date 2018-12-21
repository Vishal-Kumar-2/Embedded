var z = document.createElement('innerHTML'); // is a node
z.innerHTML = `
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <section class="custom-social-proof" >
    <div class="custom-notification">
      <div class="custom-notification-container">
        <div class="custom-notification-image-wrapper">
          <img src="https://static1.squarespace.com/static/525dcddce4b03a9509e033ab/t/526800ffe4b0ee2599668050/1382547712599/fire.png">
        </div>
        <div class="custom-notification-content-wrapper">
          <p class="custom-notification-content">
           <b> 444 people </b> are visiting <br>this page right now. <br><strong class="verify"> <i class="fa fa-check-circle"></i> verified by Enkode </strong>
          </p>
        </div>
      </div>
      <div class="custom-close"> <i class="fa-fa-close"></i></div>
    </div>
  </section>
`;

$(document).ready(function() {
  $( "body" ).append(z);
  setInterval(function() {
    $(".custom-social-proof").stop().slideToggle('slow'); }, 4000);
    $(".custom-close").click(function() {
    $(".custom-social-proof").stop().slideToggle('slow');
  });
})
