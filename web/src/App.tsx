import { useState, useEffect } from 'react';

import * as Dialog from '@radix-ui/react-dialog'

import { GameBanner } from './components/GamerBanner';

import './styles/main.css';

import {ArrowLeft, ArrowRight} from 'phosphor-react';

import logoImg from './assets/logo-nlw-eSports.svg';
import { CreateAdBanner } from './components/CreateAtBanner';
import { CreateAdModal } from './components/CreateAdModal';
import axios from 'axios';
import { useKeenSlider, KeenSliderOptions } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";



interface Game{
  id: string;
  tittle: string;
  bannerUrl : string;
  _count : {
    ads: number;
  }
}


export default function App() {
  const [games, setGames] = useState<Game[]>([])

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slideOptions, setSlideOptions] = useState<KeenSliderOptions>({});
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(slideOptions);


  useEffect(() => {
    axios('http://localhost:3333/games')
    .then(response => {
      setGames(response.data)
    }).then(()=>
    setSlideOptions({
      initial: 0,
      slideChanged:(slider)=>{
        setCurrentSlide(slider.track.details.rel);
      },
      slides:{
        perView:6,
        spacing:15,
      }
    })
  )
  }, [])



    return (
      <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
        <img src={logoImg} alt="" />

        <h1 className='text-6xl text-white font-black mt-20'>
          Seu <span className='bg-nlw-gradient bg-clip-text text-transparent'>Duo</span> está aqui!
        </h1>

        
        <div ref={sliderRef} className='keen-slider relative mt-16'>
          <button
            className="absolute rounded-full p-2 text-white z-[1] left-2 top-1/2 
            -translate-y-1/2 bg-black/25 hover:bg-black/50 backdrop-blur disabled:opacity-0"
            onClick={()=>instanceRef.current?.prev()}
          >
            <ArrowLeft className='w-8 h-8' />
          </button>
          {games.map(game => {
            return (
              <GameBanner
                key={game.id}
                tittle={game.tittle}
                bannerUrl={game.bannerUrl}
                adsCount={game._count.ads} />
            );
          })}
          <button 
            className="absolute rounded-full p-2 text-white z-[1] right-2 top-1/2 
            -translate-y-1/2 bg-black/25 hover:bg-black/50 backdrop-blur disabled:opacity-0"
            onClick={()=>instanceRef.current?.next()}
            >
              <ArrowRight className='w-8 h-8' />
          </button>
        </div>
        

        <Dialog.Root>
          <CreateAdBanner />

          <CreateAdModal />
        </Dialog.Root>

      </div>
    );
  }


