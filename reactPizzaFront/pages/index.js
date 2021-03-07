import Head from 'next/head'
import axios from 'axios'
import Link from 'next/link'
import Slider from "react-slick";

function Home({sliders, categoriesList}) {

    const settings = {
      infinite: true,
      speed: 500,
      autoplaySpeed: 3000,
      fade: false,
      centerMode: true,
      arrows: false,
      variableWidth: true,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1
  }

  return (
    <>
      <Head>
          <link rel="stylesheet" href='/slick.min.css'/>
      </Head>

      <Slider {...settings}>
        {sliders[0].sliderMedia.map(slide => (
          <img src={process.env.NEXT_PUBLIC_SERVER_URL + slide.url} alt=""/>
        ))}
      </Slider>



      <div className="container mainPage">
        <div className="row">
            {categoriesList.map(category => (
              <>
              
              {category.children.length > 0 ? <h5 style={{marginTop: '40px', fontWeight: '600'}}>{category.title}</h5> : null}
              
              {category.children.map(child => 
                <div className="col-sm-3">
                  <Link href={`/childCard/${child.childSlug}`}>
                    <a>
                      <div className="child">
                        <img src={process.env.NEXT_PUBLIC_SERVER_URL + child.childPhoto.url} alt=""/>
                        <h1>{child.childName + (category.title === 'Пицца' ? ' от ' : ' - ') + child.childPrice + '₽'}</h1>
                        <div className="select">Выбрать</div>
                      </div>
                    </a>
                  </Link>
                </div>
              )}

              </>
            ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {

  const getCategories = `
  query {
    categories {
      title
      children {
        childName
        childPrice
        childSlug
        childPhoto {
          url
        }
      }
    }
  }
  `
  const categoriesList = await axios ({
    method: 'GET',
    url: process.env.NEXT_PUBLIC_SERVER_URL + '/graphql?query=' + encodeURIComponent(getCategories)
  }).then(res => res.data.data.categories);


  const slidersGet = `
  query {
    sliderPromos (where: {id: "1"}) {
      sliderMedia {
        url
      }
    }
  }
  `
  const sliders = await axios ({
    method: 'GET',
    url: process.env.NEXT_PUBLIC_SERVER_URL + '/graphql?query=' + encodeURIComponent(slidersGet)
  }).then(res => res.data.data.sliderPromos);

  return {
    props:{
      sliders, categoriesList
    }
  }
}

export default Home;