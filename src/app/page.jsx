"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

// セクションヘッダーのコンポーネント化
const SectionHeader = ({ title, subtitle, underlineColor }) => (
  <div className="relative mb-8 md:mb-12 px-4">
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-black">
      <span className="relative inline-block pb-4">
        {title}
        <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#7fbcd1]"></span>
      </span>
    </h2>
    {subtitle && (
      <p className="mt-6 text-sm md:text-lg lg:text-xl text-gray-600 text-center">
        {subtitle}
      </p>
    )}
  </div>
);

// もしくは別のデザインバージョン
const SectionHeader2 = ({ title, subtitle }) => (
  <div className="relative mb-12 md:mb-16 px-4">
    <h2 className="relative inline-block text-2xl md:text-3xl lg:text-4xl font-bold text-center w-full">
      <span className="relative z-10">{title}</span>
      <span className="absolute left-0 bottom-1 w-full h-3 bg-rose-200/30 -rotate-1 z-0"></span>
    </h2>
    {subtitle && (
      <p className="mt-6 text-sm md:text-base text-gray-600 text-center">
        {subtitle}
      </p>
    )}
  </div>
);

// カラーパレットの定義
const colors = {
  primary: {
    bg: 'bg-white',      // 背景色を白に変更
    text: 'text-[#4a4a4a]',  // ダークグレー
    accent: 'bg-[#7fbcd1]',  // 新しいアクセントカラー
  },
  secondary: {
    light: 'bg-[#fdfbf9]',   // オフホワイト
    border: 'border-[#e8e2dc]', // ライトベージュ
    hover: 'hover:bg-[#f3efe9]', // ホバー時のベージュ
  }
};

// Instagramの埋め込みを最適化
const InstagramEmbed = ({ url }) => {
  return (
    <div className="w-full aspect-[9/16] max-w-[280px] mx-auto">
      <iframe 
        src={url}
        className="w-full h-full"
        frameBorder="0" 
        scrolling="no" 
        allowtransparency="true"
      />
    </div>
  );
};

// スタッフカードコンポーネントの作成
const StaffCard = ({ image, name, position, message }) => {
  return (
    <div className="bg-[#f5f5f5] p-4 md:p-8 rounded-xl shadow-sm">
      <div className="bg-white/80 p-6 rounded-xl shadow-sm h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-4">
          <i className="fas fa-quote-left text-[#7fbcd1] text-xl"></i>
          <span className="text-[#7fbcd1] font-medium"></span>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-full border-4 border-white shadow-md mr-4 flex-shrink-0">
            <Image
              src={image}
              alt={`スタッフ${name}`}
              width={128}
              height={128}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <p className="font-bold text-lg">{name}</p>
            <p className="text-sm text-gray-600">{position}</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
            {message}
          </p>
          
        </div>
      </div>
    </div>
  );
};

// スライドショーコンポーネントを追加
const ImageSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFirstView, setIsFirstView] = useState(true);
  const { ref: slideRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  const images = [
    {
      src: "/image/t1.jpeg",
      alt: "店内の様子"
    },
    {
      src: "/image/t2.jpeg",
      alt: "店内の様子"
    },
    {
      src: "/image/t3.jpeg",
      alt: "店内の様子"
    },
    {
      src: "/image/t4.jpeg",
      alt: "店内の様子"
    },
    {
      src: "/image/gaikan1.JPG",
      alt: "外観の様子"
    },
  ];

  useEffect(() => {
    let timer;
    if (inView) {
      if (isFirstView) {
        setIsFirstView(false);
        timer = setTimeout(() => {
          setCurrentImageIndex(1);
          timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
              prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
          }, 3000);
        }, 1000);
      } else {
        timer = setInterval(() => {
          setCurrentImageIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
          );
        }, 3000);
      }
    }
    return () => {
      clearTimeout(timer);
      clearInterval(timer);
    };
  }, [inView, isFirstView, images.length]);

  return (
    <div 
      ref={slideRef}
      className="relative w-full aspect-[16/9] overflow-hidden shadow-lg max-h-[600px]"
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-transform duration-700 ease-in-out ${
            index === currentImageIndex 
              ? 'translate-x-0 opacity-100 visible' 
              : index < currentImageIndex
                ? '-translate-x-full opacity-0 invisible'
                : 'translate-x-full opacity-0 invisible'
          }`}
          style={{
            zIndex: index === currentImageIndex ? 1 : 0,
            transitionProperty: 'transform, opacity, visibility'
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover object-center"
            priority={index === 0}
            quality={85}
          />
        </div>
      ))}
      
      {/* インジケーター */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`スライド ${index + 1} へ移動`}
          />
        ))}
      </div>
    </div>
  );
};

function MainComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 各セクションのIntersectionObserverを設定
  const [conceptRef, conceptInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px'
  });
  const [staffRef, staffInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px'
  });
  const [requirementsRef, requirementsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px'
  });
  const [qaRef, qaInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px'
  });
  const [ownerRef, ownerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px'
  });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 悩みセクションの各項目用のIntersectionObserver
  const concerns = [
    "産後、低単価サロンなら簡単だと思い入社",
    "教育時間は営業時間外で疲弊💦即戦力として求められる💦",
    "自信がないまま、1人で5〜7名をこなさなければならず疲弊💦\n子どもが発熱、予約を代わってもらえず無理やり保育園へ入れる毎日💦",
    "仕事をこなすことに精一杯で駒のように感じる💦",
  ];

  const concernRefs = concerns.map(() => useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px'
  }));

  // アニメーション用のIntersectionObserver設定を確認
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1, // より早くトリガーされるように閾値を下げる
    rootMargin: '-50px'
  });

  // アニメーションクラスの定義を確認
  const fadeInUpClass = 'transition-all duration-1000 ease-out';
  const fadeInUpAnimation = (inView) => 
    `${fadeInUpClass} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`;

  // 特徴セクション用のIntersectionObserver設定を追加
  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px'
  });

  const RequirementSection = () => {
    const requirements = [
      {
        main: "ネイリスト経験者で、技術を向上させたい",
        sub: "JNECネイリスト検定（旧JNA）をお持ちで、スカルプチュアやジェルネイルの技術を磨きたい方"
      },
      {
        main: "美容師免許をお持ちで、アイリストに挑戦したい",
        sub: "まつげパーマ、アイラッシュ、まつげエクステの技術を学び、ネイルも出来る方大歓迎"
      },
      {
        main: "柔軟な働き方を求める方",
        sub: "パート、正社員、業務委託から選択可能。週1回から週6回まで、シフト制で働けます"
      },
      {
        main: "学び続けたい、成長したい方",
        sub: "費用は会社負担で外部講習に参加可能。自己成長もできる環境です"
      },
      {
        main: "チームワークを大切にできる方",
        sub: "スタッフ同士が仲良く、不安や心配事はみんなで解決。仲間の夢を応援できる方"
      }
    ];

    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.2,
      rootMargin: '-50px'
    });

    return (
      <section className="py-16 md:py-24 bg-white">
        <SectionHeader 
          title="求める人材"
          subtitle="私たちと一緒に働きませんか？"
        />

    
        
        <div className="max-w-6xl mx-auto px-4">
          <div 
            ref={ref}
            className={`space-y-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {requirements.map((req, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-[#7fbcd1]/20 rounded-full flex items-center justify-center">
                      <span className="text-black text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 w-full">
                    <p className="text-base md:text-lg font-bold text-black">
                      {req.main}
                    </p>
                    <p className="text-sm md:text-base text-gray-600">
                      {req.sub}
                    </p>
                    {req.images && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {req.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="space-y-2">
                            <div className="relative aspect-video">
                              <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <p className="text-sm text-gray-600 text-center font-medium">
                              {img.caption}
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {img.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          

          
        </div>
      </section>
    );
  };

  // 悩みセクション用のIntersectionObserver設定を調整
  const { ref: concernsRef, inView: concernsInView } = useInView({
    triggerOnce: true,
    threshold: 0.05, // より早くトリガーされるように閾値を下げる
    rootMargin: '-10px' // マージンを小さくしてより早くトリガー
  });

  // useEffectを追加（returnの前に配置）
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollPercentage = (scrollPosition / windowHeight) * 100;

      // メインコンテンツのアニメーション
      const elements = document.querySelectorAll('.opacity-0:not(.instagram-tab)');
      if (scrollPercentage >= 20) {
        elements.forEach(element => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      }

      // インスタグラムタブの表示制御
      const instagramTab = document.querySelector('.instagram-tab');
      if (instagramTab) {
        if (scrollPosition > windowHeight * 0.8) { // 画面の80%以上スクロールしたら表示
          instagramTab.style.opacity = '1';
          instagramTab.style.visibility = 'visible';
          instagramTab.style.transform = 'translateX(calc(100% - 40px))';
        } else {
          instagramTab.style.opacity = '0';
          instagramTab.style.visibility = 'hidden';
          instagramTab.style.transform = 'translateX(100%)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-noto-sans relative">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center px-4 h-16">
            <div className="text-xl font-bold">
              Lokahi
            </div>
            {/* PC用ナビゲーション */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#concept" className="hover:text-[#7fbcd1] transition-colors duration-300">amberlで働くことで得られる事</a></li>
                <li><a href="#staff" className="hover:text-[#7fbcd1] transition-colors duration-300">スタッフ紹介</a></li>
                <li><a href="#requirements" className="hover:text-[#7fbcd1] transition-colors duration-300">募集要項</a></li>
                <li><a href="#qa" className="hover:text-[#7fbcd1] transition-colors duration-300">よくある質問</a></li>
                <li><a href="#owner-message" className="hover:text-[#7fbcd1] transition-colors duration-300">オーナー挨拶</a></li>
              </ul>
            </nav>
            {/* モバイル用ハンバーガーメニュー */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
              aria-label="メニュー"
            >
              <div className="w-6 h-4 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-full h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
        
        {/* モバイル用メニュー */}
        <div className={`md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <nav className="p-4">
            <ul className="space-y-4">
              <li><a href="#concept" className="block py-2" onClick={() => setIsMenuOpen(false)}>Lokahiで働くことで得られる事</a></li>
              <li><a href="#staff" className="block py-2" onClick={() => setIsMenuOpen(false)}>スタッフ紹介</a></li>
              <li><a href="#requirements" className="block py-2" onClick={() => setIsMenuOpen(false)}>募集要項</a></li>
              <li><a href="#qa" className="block py-2" onClick={() => setIsMenuOpen(false)}>よくある質問</a></li>
              <li><a href="#owner-message" className="block py-2" onClick={() => setIsMenuOpen(false)}>オーナー挨拶</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* インスタグラムリンクタブ（モバイル用） */}
      <a
        href="https://www.instagram.com/eye_nail_lokahi/?igsh=am9jZGR3eGltdm80#"
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-tab fixed top-20 right-0 z-50 bg-gradient-to-tr from-[#FFD600] via-[#FF7A00] via-[#FF0069] via-[#D300C5] to-[#7638FA] text-white p-3 rounded-l-lg shadow-lg transform translate-x-full hover:translate-x-0 transition-all duration-300 md:hidden opacity-0 invisible"
        style={{ animationFillMode: 'forwards' }}
      >
        <i className="fab fa-instagram text-2xl"></i>
      </a>

      {/* ファーストビュー */}
      <div className="pt-16">
        <div className="relative">
          <div className="w-full">
            <Image
              src="/image/detail_top.jpg"
              alt="明るく清潔感のあるサロン内装"
              width={1200}
              height={600}
              className="md:w-full md:h-[80vh] w-screen h-auto object-cover"
              priority
            />
            {/* メッセージのオーバーレイ */}
            <div className="absolute inset-0 flex items-center">
              <div className="text-white px-0 md:px-12 ml-4 md:hidden"> {/* md:hidden を追加してPCでは非表示に */}
                <h1 className="text-3xl md:text-3xl font-medium tracking-wider leading-relaxed mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-shadow-strong">
                  No Lokahi No Life
                </h1>
              </div>
            </div>
            <Image
              src="/image/top2.png"
              alt="lokahiスタッフ集合写真"
              width={1200}
              height={600}
              className="md:w-full md:h-[80vh] w-screen h-auto object-cover"
              priority
            />
          </div>
        </div>
        {/* メッセージセクション */}
        <div className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* 最初のメッセージ */}
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-medium tracking-wider leading-relaxed mb-3 opacity-0 translate-y-10 transition-all duration-1000 ease-out" style={{ animationFillMode: 'forwards' }}>
                No Lokahi No Life
                </h1>
              </div>

              {/* 2番目のメッセージ */}
              <div className="text-left">
                <p className="text-base md:text-lg leading-loose tracking-wider opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300" style={{ animationFillMode: 'forwards' }}>
                  「やりたいこと」より先に、<br />「自分らしさ」を。<br />
                  環境の変化に寄り添い、<br />
                  あなたの人生に合わせた働き方を。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* セクション間のセパレーター */}
      <div className="w-full h-4 bg-white"></div>

      {/* 以降の既存のセクション */}

      <section className="py-8 md:py-12 mt-4 md:mt-6 bg-white">
        <div className="relative z-10">
          <SectionHeader 
            title={<>「このままでいいのかな...」<br />そんな不安から解放されます</>}
            subtitle="今の環境に少しでも違和感を感じているあなたへ"
            underlineColor="#7fbcd1"
          />
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 gap-2 md:gap-8">
              {/* 左側: 一般的なネイルサロンの悩み */}
              <div className="p-2 md:p-6 rounded-lg h-full flex flex-col">
                <h3 className="text-base md:text-xl font-bold text-center mb-3 md:mb-6 text-gray-500">＜よくある悩み＞</h3>
                <div className="flex flex-col items-center gap-2 md:gap-4 flex-grow">
                  {[
                    "将来のライフスタイルが不安...\n結婚や出産後も続けられる仕事なのかな",
                    "キャリアの見通しが持てない...\n技術以外の成長の機会が欲しい",
                    "自分らしい働き方ができるか...\n環境の変化に対応できるのかな"
                  ].map((concern, index) => (
                    <React.Fragment key={index}>
                      <div className="border-2 border-gray-200 rounded-lg p-2 md:p-4 w-full text-left bg-white shadow-sm text-xs md:text-base leading-relaxed text-gray-600 min-h-[120px] md:min-h-[140px] flex items-center justify-start px-4 md:px-6 whitespace-pre-wrap">
                        {concern}
                      </div>
                      
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 右側: amberlの場合 */}
              <div className="p-2 md:p-6 rounded-lg h-full flex flex-col">
                <h3 className="text-base md:text-xl font-bold text-center mb-3 md:mb-6 text-black">＜Lokahiの場合＞</h3>
                <div className="flex flex-col items-center gap-2 md:gap-4 flex-grow">
                  {[
                    "ライフスタイルに合わせた働き方✨\n結婚・出産後の復職実績が豊富です",
                    "キャリアアップのための環境を整えています✨あなたの希望に合わせた働き方が可能です",
                    "1店舗だから実現できる柔軟性✨\n人生の変化に寄り添える環境があります"
                  ].map((solution, index) => (
                    <React.Fragment key={index}>
                      <div className="border-2 border-[#7fbcd1] rounded-lg p-2 md:p-4 w-full text-left bg-white shadow-sm text-xs md:text-base leading-relaxed min-h-[120px] md:min-h-[140px] flex items-center justify-start px-4 md:px-6 whitespace-pre-wrap">
                        {solution}
                      </div>
                      
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セクション間のセパレーター */}
      <div className="w-full h-16 bg-white"></div>

      {/* 特徴セクション */}
      <div className="mt-4 bg-white relative overflow-hidden">
        <div className="relative z-10">
          <SectionHeader 
            title="Lokahiの特徴"
          />
         
          <div className="mt-8 md:mt-12">
            <div 
              className={`w-full max-w-4xl mx-auto transition-all duration-1000 ${
                featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <ImageSlideshow />
            </div>
          </div>

          <br />

          <div 
            ref={featuresRef}
            className="text-base md:text-xl leading-relaxed text-center max-w-3xl mx-auto space-y-6"
          >
            <div 
              className={`bg-white rounded-lg p-6 shadow-md border border-[#7fbcd1]/20 hover:shadow-lg transition-all duration-700 ${
                featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="text-[#7fbcd1] font-bold text-lg">①</span>
              落ち着いた環境で施術に集中できる
              
              <br />
              <br />
              <span className="text-gray-700 text-sm md:text-base">
                駅前の商店街に位置する、マンションの1室。
                <br />
                女性限定の完全予約制サロンのため、
                <br />
               落ち着いた環境で
                <br />
                お客様一人一人と向き合えます。
                <br />
                リピーターの多い、アットホームな雰囲気で
                <br />
                活気のある職場環境です。
                <br />
                
              </span>
            </div>

            <div 
              className={`bg-white rounded-lg p-6 shadow-md border border-[#7fbcd1]/20 hover:shadow-lg transition-all duration-700 ${
                featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <span className="text-[#7fbcd1] font-bold text-lg">②</span>
              安心して長く働ける
              <br />
              充実した環境があります
              <br />
              <br />
              <span className="text-gray-700 text-sm md:text-base">
                業界水準の給与体系で安定して働けます。
                <br />
                <span className="text-[#7fbcd1] font-medium">
                  完全週休2日制・残業なし
                </span>
                の環境で、
                <br />
                現在は全員がママさんスタッフとして活躍中。
                <br />
                出産後の復職実績も豊富で、
                <br />
                <span className="bg-[#7fbcd1]/10 px-2 py-1 rounded inline-block mt-1">
                  長く安心して働ける職場づくりを大切にしています
                </span>
              </span>
            </div>

            <div 
              className={`bg-white rounded-lg p-6 shadow-md border border-[#7fbcd1]/20 hover:shadow-lg transition-all duration-700 ${
                featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <span className="text-[#7fbcd1] font-bold text-lg">③</span>
              自分らしいキャリアを
              <br />
              自由に選択できる
              <br />
              <br />
              <span className="text-gray-700 text-sm md:text-base">
                <span className="text-[#7fbcd1] font-medium">月1回のセミナー</span>では、
                <br />
                技術だけでなく、経営やお金の知識など
                <br />
                幅広い学びの機会を提供。
                <br />
                <span className="border-b border-[#7fbcd1]">学びたい技術があれば、費用は会社負担で<br />外部講習に行く事も可能</span>など、
                <br />
                キャリアアップを目指す方への環境も充実。
                <br />
                <br />
                <span className="bg-[#7fbcd1]/10 px-2 py-1 rounded inline-block mt-1">
                  あなたの描く理想の人生に合わせて、
                  <br />
                  自由に選択できる環境があります
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* セクション間のセパレーター */}
      <div className="w-full h-2 bg-white"></div>

      {/* 得られることセクション */}
      <section id="concept" className="py-16 md:py-24 bg-white">
        <SectionHeader 
          title="Lokahiで働くことで得られる事"
          subtitle="あなたらしい働き方"
        />
        <div className="max-w-6xl mx-auto px-4">
          <div 
            ref={contentRef}
            className="space-y-8"
          >
            <div 
              className={`bg-white p-8 rounded-lg shadow transition-all duration-700 ${
                contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <h3 className="text-2xl mb-4 font-bold">
                自分の価値観で働ける喜び
              </h3>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="w-full md:w-[400px] flex-shrink-0">
                  <Image
                    src="/image/kazoku.jpg"
                    alt="スタッフの様子"
                    width={400}
                    height={300}
                    className="w-full h-[300px] md:h-[300px] rounded-sm object-cover"
                  />
                </div>
                <p className="text-base md:text-lg leading-relaxed">
                  「こうあるべき」という固定観念から解放されます。
                  売上や組織の価値観に縛られず、
                  あなたが大切にしたいものを優先できる。
                  自分の人生を、自分の価値観で働くことができる環境です。
                </p>
              </div>
            </div>

            <div 
              className={`bg-white p-8 rounded-lg shadow transition-all duration-700 ${
                contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
           
              <h3 className="text-2xl mb-4 font-bold">
                新しい可能性との出会い
              </h3>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="w-full md:w-[400px] flex-shrink-0">
                  <Image
                    src="/image/sutoresu.jpg"
                    alt="スタッフの様子"
                    width={400}
                    height={300}
                    className="w-full h-[300px] md:h-[300px] rounded-sm object-cover"
                  />
                </div>
                <p className="text-base md:text-lg leading-relaxed">
                  技術だけでなく、経営やお金の知識を得ることで、
                  人生の選択肢が広がっていきます。
                  「ネイリスト・アイリスト」の枠を超えて、
                  自分の可能性を再発見でき、
                  新しい夢や目標に出会える場所です。
                </p>
              </div>
            </div>

            <div 
              className={`bg-white p-8 rounded-lg shadow transition-all duration-700 ${
                contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <h3 className="text-2xl mb-4 font-bold">
                心からの笑顔を取り戻せる
              </h3>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="w-full md:w-[400px] flex-shrink-0">
                  <Image
                    src="/image/newtokutyou.jpg"
                    alt="スタッフの様子"
                    width={400}
                    height={300}
                    className="w-full h-[300px] md:h-[300px] rounded-sm object-cover"
                  />
                </div>
                <p className="text-base md:text-lg leading-relaxed">
                  人間関係の悩みやプレッシャーから解放され、
                  本来の自分を取り戻せます。
                  仕事を楽しみ、プライベートも充実させ、
                  自分の人生を豊かに、より生きやすくなります。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セクション間のセパレーター */}
      <div className="w-full h-2 bg-white"></div>

      {/* 現場仕事の日のとある1日セクション - 独立したセクションとして実装 */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="relative z-10">
          <SectionHeader 
            title="1日の流れ（早番の場合）"
          />
          
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-6">
              {[
                { time: "8:30", activity: "店内清掃、カルテ管理、予約確認等お客様ご来店前の準備" },
                { time: "9:00-17:30", activity: "施術\nチームとして自分以外のスタッフフォローもできる範囲で行い、助け合う" },
                { 
                  time: "17:30以降", 
                  activity: "最終予約終了後、清掃、売上管理、カルテ記入",
                  note: "※遅番の場合19時頃終了"
                }
              ].map((schedule, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-6 group hover:bg-gray-50 p-4 transition-all duration-300"
                >
                  <div className="w-24 flex-shrink-0">
                    <span className="text-[#7fbcd1] font-medium text-sm">{schedule.time}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="text-gray-800 text-sm font-medium">{schedule.activity}</div>
                    {schedule.note && (
                      <div className="text-xs text-gray-500 mt-1 italic">{schedule.note}</div>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* セクション間のセパレーター */}
      <div className="w-full h-2 bg-white"></div>

      {/* スタッフ紹介セクション */}
      <section id="staff" className="py-16 md:py-24 bg-white">
        <SectionHeader 
          title="スタッフ紹介"
          subtitle="働く仲間"
        />
        
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-8">
            <StaffCard 
              image="/image/asan.png"
              name="Aさん"
              position="入店1ヶ月"
              message={`他店でネイリスト歴2年、美容師免許も取得していてまつ毛パーマもできるハイブリッドな働き方です。

人間関係はみんなが無理なく働いていて、ゆったりとしたいい雰囲気。

結婚後や出産後に働き方を変えられるのも魅力です。

自分の気持ちとお店の進み具合などのすり合わせを定期的に面談でしてもらえたり、

自分は朝が苦手なので
相談すると早めに出勤時間を対応してもらえた事も安心できました。`}
            />
            
            <StaffCard 
              image="/image/bsan.png"
              name="Bさん "
              position="未経験入店"
              message={`私は未経験で入店し、アイリスト歴2年です。

パーマやエクステができるようになってから、ネイルにも興味がありセルフでもやっていたのでネイリストの道も挑戦させて貰いました。　

ただ、アイとの両立が思った以上に難しく自分の子育てもあり今は断念しましたが、

オーナーは、

「やりたくなったらまた教えてね。挑戦する人を応援したいから」

と暖かい言葉をかけてくれました。

今はアイに集中していますが、それで教えてくれた先輩方とギクシャクする事もなく

「今はできない」という事を一緒に受け止めてくれました。
このお店に来て良かったです。`}
            />
          </div>
        </div>
      </section>

    

      {/* セクション間のセパレーター */}
      <div className="w-full h-2 bg-white"></div>

      <section className="py-16 md:py-24 bg-white relative overflow-hidden" id="requirements" ref={requirementsRef}>
  <div className="relative z-10">
    <SectionHeader 
      title="募集要項"
      subtitle="採用情報"
    />
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {[
          {
            title: "勤務地",
            content: "神奈川県鎌倉市大船1-13-15 skyビル203（大船駅徒歩3分）"
          },
          {
            title: "募集職種",
            content: (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-4 text-[#7fbcd1]">ネイリスト</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">応募条件</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>経験者のみ</li>
                        <li>JNECネイリスト検定（旧JNA）必要</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">給与</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>パート：時給1,225円〜</li>
                        <li>社員：19万円〜</li>
                        <li>業務委託：完全歩合、出来高40％〜50％</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">勤務時間</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>正社員<br />・8:30〜17:30（時短応相談）<br />・9:00〜18:00（時短応相談）<br />・10:00〜19:00（時短応相談）</li>
                        <li>アルバイト・パート<br />・8:30〜17:30（時短応相談）<br />・9:00〜18:00（時短応相談）<br />・10:00〜19:00（時短応相談）</li>
                        <li>業務委託<br />・週1回〜週6回、シフト制、時短勤務OK<br />・09:00〜17:00（時短応相談）<br />・11:00〜19:00（時短応相談）<br />・13:00〜21:00（時短応相談）</li>
                        <li>最大7時間勤務、3時間からOK</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">仕事内容</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>スカルプチュア</li>
                        <li>ジェルネイル</li>
                        <li>パリジェンヌ、マツエク、まつげパーマも出来る方、大歓迎！</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-[#7fbcd1]">アイリスト</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">応募条件</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>美容師免許必要</li>
                        <li>未経験OK</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">給与</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>正社員：月給19.0万円〜25.0万円</li>
                        <li>アルバイト・パート：時給1,162円〜</li>
                        <li>業務委託：完全歩合、出来高40％〜50％</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">勤務時間</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>正社員<br />・09:00〜17:00（時短応相談）<br />・11:00〜19:00（時短応相談）<br />・13:00〜21:00（時短応相談）</li>
                        <li>アルバイト・パート<br />・09:00〜21:00（時短応相談）<br />・1日3時間からOK</li>
                        <li>業務委託<br />・週1回〜週6回、シフト制、時短勤務OK<br />・09:00〜17:00（時短応相談）<br />・11:00〜19:00（時短応相談）<br />・13:00〜21:00（時短応相談）</li>
                        <li>最大7時間勤務、3時間からOK</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">仕事内容</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>まつげパーマ</li>
                        <li>アイラッシュ</li>
                        <li>まつげエクステ</li>
                        <li>マツエク、パリジェンヌ、まつげパーマの施術</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          },
          {
            title: "休日・休暇",
            content: (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">休日制度</h5>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>完全週休2日制</li>
                    <li>日曜休み</li>
                    <li>土日休み</li>
                    <li>夏季冬季休暇有り</li>
                    <li>希望休、勤務時間は考慮致します</li>
                    <li>業務委託：土日出勤出来る方、大歓迎★</li>
                  </ul>
                </div>
              </div>
            )
          },
          {
            title: "福利厚生",
            content: (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">基本福利厚生</h5>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>インセンティブあり</li>
                    <li>ノルマなし</li>
                    <li>社会保険完備</li>
                    <li>寮完備</li>
                    <li>交通費支給</li>
                    <li>独立・開業支援</li>
                    <li>制服あり</li>
                    <li>育児休暇あり</li>
                    <li>社員登用あり</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">交通費・その他</h5>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>交通費：社員15,000円まで、パート10,000円まで</li>
                    <li>エプロン貸出</li>
                  </ul>
                </div>
              </div>
            )
          }
        ].map((item, index) => (
          <div 
            key={index}
            className={`flex flex-col md:flex-row border-b border-gray-100 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
          >
                  <div className="w-full md:w-1/4 p-4 md:p-6">
              <h4 className="font-bold text-gray-800">{item.title}</h4>
            </div>
            <div className="w-full md:w-3/4 p-4 md:p-6">
              {typeof item.content === 'string' ? (
                <p className="text-gray-600">{item.content}</p>
              ) : (
                item.content
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <RequirementSection />

      {/* セクション間のセパレーター */}
      <div className="w-full h-2 bg-white"></div>
  
      <section className="py-16 md:py-24 bg-white relative overflow-hidden" id="qa" ref={qaRef}>
  <div className="relative z-10">
    <SectionHeader 
      title="よくあるご質問"
      subtitle="Q&A"
    />
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <p className="text-center text-base text-gray-700 leading-relaxed">
        あなたの好きな働き方、好きな作業、<br />やりたいこと、やりたくないこと、<br />遠慮なく話し合っていきましょう！
      </p>
    </div>
    <div className="max-w-6xl mx-auto px-4">
      <div className="space-y-4">
        {[
          {
            question: "働く日数を途中から減らす働き方は可能ですか？どんな働き方がありますか？",
            answer: "パート、業務委託があります！ネイリストに疲れてしまったら、アイリスト、系列の美容院等もございます。美容学校に通いながらアシスタント業務をしているスタッフもおりますので遠慮なくご相談下さい。"
          },
          {
            question: "お給料の仕組みを教えて欲しいです",
            answer: "社員は売上の30%、業務委託40%、パート　時給1225円〜※各種歩合がつきます"
          },
          {
            question: "自分に寄り添って一緒に伴走してもらえるのでしょうか？",
            answer: "もちろんです。みんなで一人ひとりに合わせた「その人の個」を大切にする事が、チームに繋がっていきます。"
          }
        ].map((qa, index) => (
          <details 
            key={index} 
            className={`bg-white p-6 rounded-lg shadow-sm group transition-all duration-500 ease-out hover:shadow-md ${
              qaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <summary className="text-lg md:text-xl font-medium cursor-pointer list-none flex justify-between items-center text-gray-800">
              <span className="flex items-center gap-3">
                <span className="text-[#7fbcd1] font-bold">Q.</span>
                {qa.question}
              </span>
              <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#7fbcd1]">
                ▼
              </span>
            </summary>
            <div className="mt-6 pl-8 text-gray-600 leading-relaxed">
              <div className="flex">
                <span className="text-[#7fbcd1] font-bold text-lg mr-3">A.</span>
                <p className="text-gray-700">{qa.answer}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* セクション間のセパレーター */}
      <div className="w-full h-2 bg-white"></div>

      <section id="owner-message" className="py-12 md:py-24 bg-white">
        <div className="relative z-10">
        <SectionHeader 
          title="オーナー挨拶"
          subtitle="Message from Owner"
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-4 md:p-12 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="md:w-1/3 flex flex-col items-center text-center">
                <div className="w-32 h-32 md:w-64 md:h-64 overflow-hidden rounded-full border-4 border-white shadow-md mb-6">
                  <Image
                    src="/image/KATAGAWA.jpg"
                    alt="オーナーの写真"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover object-top"
                    priority
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">オーナー</h3>
                <p className="text-gray-600 mb-8 md:mb-0">片川</p>
              </div>
              
              <div className="md:w-2/3">
                <div className="prose prose-sm md:prose-lg max-w-none">
                  <p className="space-y-6 md:space-y-8">
                    <span className="block mb-6 md:mb-8 text-gray-800 text-base md:text-lg leading-relaxed">
                      <span className="font-bold text-[#7fbcd1]">スタッフ1人1人が、より働きやすい環境作りを第一に考えています。</span><br />

                      お気軽にご応募ください。高校卒業後、通信制のスクールに通いながら働いているスタッフ、子供の学校のあいだに働いているスタッフ、毎日フル活動しているスタッフと働き方は様々です！どこよりも働きやすく長くお仕事できる環境が整ってます！
                    </span>

                    <span className="block mb-6 md:mb-8 text-gray-800 text-base md:text-lg leading-relaxed">
                      スタッフみんながとても仲良く、不安や心配な事はみんなで解決していきます。<br />
                      また、<span className="font-bold text-[#7fbcd1]">学びたい技術があれば、できるスタッフに教わったり、費用は会社負担で外部講習に行く事も可能☆</span>あなたの可能性は無限大！一人一人が自立をし、仲間の夢を応援するサロンです！
                    </span>

                    <span className="block mb-6 md:mb-8 text-gray-800 text-base md:text-lg leading-relaxed">
                      
                      年間行事では、BBQ、入社式、レクリエーション等開催！他店のスタッフとも交流出来ます(^^)
                    </span>

                    <span className="block text-gray-800 text-base md:text-lg leading-relaxed font-bold text-[#7fbcd1]">
                      毎日楽しく働きたい、学びたい、笑顔でいたい！<br />
                      そんな方は是非、一緒に働きましょう！！
                    </span>
                  </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#333] text-white py-8 md:py-16 px-4 relative"> {/* relative を追加 */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 pb-20"> {/* pb-20 を追加してボタンのスペースを確保 */}
            <div>
              <h3 className="text-xl mb-4 flex items-center">
                <i className="fab fa-instagram text-2xl mr-2"></i>
                Instagram
              </h3>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <a 
                    href="https://www.instagram.com/eye_nail_lokahi/?igsh=am9jZGR3eGltdm80#" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-2xl hover:text-[#4a90e2]"
                  >
                    <i className="fab fa-instagram"></i>
                    <span className="text-sm ml-2">サロン公式</span>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl mb-4">店舗情報</h3>
              <p>住所：神奈川県鎌倉市大船1-13-15 skyビル203</p>
              <p>電話：052-693-6609</p>
              <p>営業時間：09:00〜21:00</p>
              
              <div className="mt-4 w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3254.2010480828612!2d139.529089975893!3d35.35065654806253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60184560e1b54ae7%3A0x322baae6ff278a26!2z44CSMjQ3LTAwNTYg56We5aWI5bed55yM6Y6M5YCJ5biC5aSn6Ii577yR5LiB55uu77yR77yT4oiS77yR77yVIFNreeODk-ODqyAyMDM!5e0!3m2!1sja!2sjp!4v1760576900999!5m2!1sja!2sjp"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokahiの所在地"
                  aria-label="Lokahiの所在地を示すGoogleマップ"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* 追従するCTAボタン - フッター内の最後に配置 */}
        <a 
          href="https://lin.ee/3u7E6NY"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#06c755] text-white py-4 shadow-lg hover:bg-[#059144] transition-all duration-300 flex items-center justify-center space-x-2 w-full"
        >
          <span className="text-base font-medium">応募する</span>
        </a>
      </footer>

      

      
    </div>
  );
}
// スタイリングの追加
const styles = {
  sectionTitle: `
    relative
    inline-block
    text-2xl md:text-3xl lg:text-4xl
    font-bold
    text-center
    pb-2
    after:content-['']
    after:absolute
    after:bottom-0
    after:left-1/2
    after:transform
    after:-translate-x-1/2
    after:w-12
    after:h-1
    after:bg-rose-400
  `,
};

MainComponent.propTypes = {
  // 必要に応じてpropTypesを定義
};

export default function Home() {
  return <MainComponent />;
}

