"use strict"

$(function () {
	$('#carouselExampleControls').carousel();
});

$(function () {
	
	$('.carousel-control-prev').on("click", function () {
		$('#carouselExampleControls').carousel('prev');
	});

});

$(function () {

	$('.carousel-control-next').on("click", function () {
		$('#carouselExampleControls').carousel('next');
	});

});