/*TODO:
add share button stuff? 
add comment stuff?

check compatibility 

CLEAN UP CODE
*/
var x = 0; 
var y = 0;
var maxh = $( ".section" ).length - 1; //sets max horizontal travel
var	maxv = $( ".section" ).eq( x ).children( ".subsec" ).length - 1; //sets max vertical travel
var hindpos = vindpos = 0;
var hindwidth = $( window ).width() / (maxh + 1)

//get hash and set initial position
for (i = 00; i < maxh + 1; i++) {
	id = $( ".section" ).eq( i ).attr("id").replace("s_", "")
	hash = window.location.hash.replace("#", "")

	if ( hash == id ) {
		x = i;
		break;
	};
};
draw();
hind();
$( window ).resize(function(){
	hind() 
});

function hind(){
	$( "#hindholder>div" ).remove();
	hindwidth = $( window ).width() / (maxh + 1)
	for (i = 0; i < maxh + 1; i++) { 
		$( "#hindholder" ).append("<div>" + $( ".section" ).eq( i ).attr('id').replace("s_", "") + "</div>");
	}
	$( "#hind, #hindholder>div" ).css({"width": hindwidth});
};

function vind(){
	$( "#vindholder>div" ).remove();
	maxv = $( ".section" ).eq( x ).children( ".subsec" ).length - 1; //why do i has to do this??

	vindpos = maxv + 1 + y + "em"
	$( "#vind" ).css({ "bottom": vindpos }, speed);
	for (i = 0; i < maxv + 1; i++) { 
    $( "#vindholder" ).append("<div></div>");
	};
};


//custom easing function to reset y offset invisibly
$.easing.easeinJump = function(x, t, b, c, d) {
	if(t == d){
		return b + c;
	}
	else{
		return b;
	}
};
	
// changes frame in focus
// there is probably a lot of room for optimization here
var speed = 500;
function move( dir ) {

	maxv = $( ".section" ).eq( x ).children( ".subsec" ).length - 1; 

	if (dir == "left" || dir == 37){ //move left
		x = Math.max(x - 1, 0)
		y = 0;
		$( ".section" ).eq( x + 1 ).animate({ "top": 0}, speed, "easeinJump"); // switch this to do it on any draw
	}
	
	else if (dir == "right" || dir == 39){ //move right
		x = Math.min(x + 1, maxh)
		y = 0;
		$( ".section" ).eq( x - 1 ).animate({ "top": 0}, speed, "easeinJump");
	}
	
	else if (dir == "down" || dir == 38){
		y = Math.min(y + 1, 0);
	}
	
	else if (dir == "up" || dir == 40){
		y = Math.max(y - 1, -maxv)
	}

//prevents animations for piling up
	q = $( ".inner, .section, #hind, #vind" )
	if( q.queue( "fx" ).length > 1){
		q.stop( true, false);
	}
	draw();
	
}

function draw(){
	mar = -x + "00%"; // switch x to string of percent
	$( ".inner" ).animate({ "margin-left": mar }, speed);
	
	sea = y + "00%"
	$( ".section" ).eq( x ).animate({ "top": sea}, speed);
	
	//indicator stuff (what's the best place to put this stuff???)
	window.location.replace( "#" + $( ".section" ).eq( x ).attr('id').replace("s_", "") );

	hindpos = hindwidth * x + "px";
	$( "#hind" ).animate({ "left": hindpos }, speed);
	
	vind();

};


//INPUT HANDLERS

//indicator
$( "#hindholder" ).on("click", "div", function( e ){
	x = $( this ).index();
	y = 0;
	draw();
});


$( "#vindholder" ).on("click", "div", function( e ){
	e.stopPropagation();
	y = -$( this ).index();
	draw();
});



//keyboard
$( document ).keydown(function( event ) {
	if( event.which >= 37 && event.which <= 40 ){ //conditional is not necessary but does it improve performance??
	move( event.which );
	}
});

//virtual buttons
$( "#left" ).click(function(){
	move("right");
});

$( "#right" ).click(function(){
	move("right");
});

$( "#intro" ).on("mouseup", function(){
	move("up");
});

$( "#share" ).click(function(){	
	console.log("some function here");
});

//touch and mouse
var mx = my = 0;
var xinit = 0;
var delx = 0;

//add some time thing for scrolling
$( ".subsec" ).swipe(function(direction, action, time, dx, dy, xinit, yinit){
	if( action == "move"){
		mx = Math.min(dx + ($( window ).width() * -x),0);
		$( ".inner" ).css({ "margin-left":  mx });
		//prevent side scrolling while scrolling overflow text
	}; 
	if( action == "end"){
		if(time > 300 && (direction == "up" || direction == "down")){ // check for overflowing element rather than do this???
		draw();
		}
		else move( direction );
	};
	},
	{threshold: 100, refresh: 15}
);









