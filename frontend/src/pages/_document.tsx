import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <meta
        name="description"
        content="Онлайн-сервис электронного судейства чемпионатов по перманентному макияжу - BeautyRank"
      />
      <meta
        name="keywords"
        content="beautyrank, бьютиранк, бьюти ранк, бьютидон, бьюти дон, перманентый макияж ростов, beautydon, beauty don"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://beautyrank.ru/" />
      <meta property="og:title" content="BeautyRank" />
      <meta
        property="og:image"
        content="https://beautyrank.ru/_next/static/media/logo.6ca3380f.svg"
      />
      <meta
        property="og:description"
        content="Онлайн-сервис электронного судейства чемпионатов по перманентному макияжу - BeautyRank"
      />
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    
                ym(97324622, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true
                });
          `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/97324622"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </Html>
  );
}
