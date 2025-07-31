document.addEventListener("DOMContentLoaded", function() {
    var lazyVideos = [].slice.call(document.querySelectorAll("video.lazyload"));

    if ("IntersectionObserver" in window) {
        var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var video = entry.target;
                    video.src = video.dataset.src;
                    video.classList.remove("lazyload");
                    lazyVideoObserver.unobserve(video);
                }
            });
        });

        lazyVideos.forEach(function(video) {
            lazyVideoObserver.observe(video);
        });
    }
});