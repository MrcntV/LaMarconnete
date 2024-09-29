
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const CarrouselAuto = () => {
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 8000,

        autoplay: true,
        autoplaySpeed: 0,
        slidesToShow: 4,
        slidesToScroll: 1,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,


                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,

                }
            }
        ]
    };


    return (

        <div className="carrousel-container">
            <Slider {...settings}>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image1.jpg" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image3.png" alt="" />
                    </a>
                </div>

                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image5.jpg" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image9.png" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image4.png" alt="" />
                    </a>
                </div>

                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image7.png" alt="" />
                    </a>
                </div>

                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image11.jpg" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image13.png" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image6.png" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image20.jpg" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image12.jpg" alt="" />
                    </a>
                </div>

                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image10.jpg" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image15.jpg" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image18.jpg" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image14.jpg" alt="" />
                    </a>
                </div>

                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image16.jpg" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image8.png" alt="" />
                    </a>
                </div>
                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image17.jpg" alt="" />
                    </a>
                </div>

                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image19.jpg" alt="" />
                    </a>
                </div>

                <div className="SlideFooter">
                    <a href="https://www.instagram.com/lamarconnete/">
                        <img src="/images/Footer/Image21.png" alt="" />
                    </a>
                </div>
            </Slider>
        </div>
    );
};

export default CarrouselAuto;
