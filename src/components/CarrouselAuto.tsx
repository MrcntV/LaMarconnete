import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// ── Images statiques de secours ──────────────────────────────────────────────
const staticImages = [
    '/images/Footer/Image1.jpg', '/images/Footer/Image3.png', '/images/Footer/Image5.jpg',
    '/images/Footer/Image9.png', '/images/Footer/Image4.png', '/images/Footer/Image7.png',
    '/images/Footer/Image11.jpg', '/images/Footer/Image13.png', '/images/Footer/Image6.png',
    '/images/Footer/Image20.jpg', '/images/Footer/Image12.jpg', '/images/Footer/Image10.jpg',
    '/images/Footer/Image15.jpg', '/images/Footer/Image18.jpg', '/images/Footer/Image14.jpg',
    '/images/Footer/Image16.jpg', '/images/Footer/Image8.png', '/images/Footer/Image17.jpg',
    '/images/Footer/Image19.jpg', '/images/Footer/Image21.png',
];

interface InstaPost {
    id: string;
    mediaUrl: string;
    permalink: string;
    caption?: string;
    mediaType?: string;
}

const INSTAGRAM_PROFILE = 'https://www.instagram.com/lamarconnete/';

const CarrouselAuto = () => {
    const [posts, setPosts] = useState<InstaPost[] | null>(null);

    useEffect(() => {
        fetch('/api/instagram/feed')
            .then(r => r.json())
            .then(data => {
                if (data.configured && data.posts && data.posts.length > 0) {
                    setPosts(data.posts);
                }
            })
            .catch(() => {});
    }, []);

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 8000,
        autoplay: true,
        autoplaySpeed: 0,
        slidesToShow: 4,
        slidesToScroll: 1,
        cssEase: 'linear',
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 600, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        ],
    };

    // Use Instagram posts if available, else static images
    const slides: { url: string; link: string; caption?: string }[] = posts
        ? posts.filter(p => p.mediaType !== 'VIDEO' || p.mediaUrl).map(p => ({
            url: p.mediaUrl,
            link: p.permalink || INSTAGRAM_PROFILE,
            caption: p.caption,
        }))
        : staticImages.map(url => ({ url, link: INSTAGRAM_PROFILE }));

    return (
        <div className="carrousel-container">
            <Slider {...settings}>
                {slides.map((slide, i) => (
                    <div className="SlideFooter" key={i}>
                        <a href={slide.link} target="_blank" rel="noopener noreferrer">
                            <img
                                src={slide.url}
                                alt={slide.caption ? slide.caption.slice(0, 60) : 'Instagram @lamarconnete'}
                                loading="lazy"
                            />
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default CarrouselAuto;
