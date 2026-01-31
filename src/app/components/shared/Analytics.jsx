"use client";

import Script from "next/script";

export function Analytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const TWITTER_PIXEL_ID = process.env.NEXT_PUBLIC_TWITTER_PIXEL_ID;
  const LINKEDIN_PIXEL_ID = process.env.NEXT_PUBLIC_LINKEDIN_PIXEL_ID;
  const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const PINTEREST_TAG_ID = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
  const MICROSOFT_UET_ID = process.env.NEXT_PUBLIC_MICROSOFT_UET_ID;

  return (
    <>
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {FACEBOOK_PIXEL_ID && (
        <>
          <Script id="facebook-pixel" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1"/>`,
            }}
          />
        </>
      )}

      {/* Twitter Universal Website Tag */}
      {TWITTER_PIXEL_ID && (
        <Script id="twitter-pixel" strategy="lazyOnload">
          {`
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,
            u.src='//static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}
            (window,document,'script');
            twq('config', { pid: '${TWITTER_PIXEL_ID}' });
          `}
        </Script>
      )}

      {/* LinkedIn Insight Tag */}
      {LINKEDIN_PIXEL_ID && (
        <>
          <Script id="linkedin-pixel" strategy="lazyOnload">
            {`
              _linkedin_partner_id = "${LINKEDIN_PIXEL_ID}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            `}
          </Script>
          <Script id="linkedin-pixel-script" strategy="lazyOnload">
            {`
              (function(l) {
              if (!l){window.lintrk = function(a){window.lintrk.q.push(a);};
              window.lintrk.q=[];}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);})(window.lintrk);
            `}
          </Script>
        </>
      )}

      {/* TikTok Pixel */}
      {TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="lazyOnload">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)));}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<arguments.length;n++)e[n]=arguments[n];return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* Pinterest Tag */}
      {PINTEREST_TAG_ID && (
        <Script id="pinterest-tag" strategy="lazyOnload">
          {`
            !function(e){
              if(!window.pintrk){window.pintrk=function(){
              window.pintrk.queue.push(Array.prototype.slice.call(arguments));
              };
              var n=window.pintrk;
              n.queue=[],n.version="3.0";
              var t=document.createElement("script");
              t.async=!0,t.src=e;
              var r=document.getElementsByTagName("script")[0];
              r.parentNode.insertBefore(t,r);
              }
            }("https://s.pinimg.com/ct/core.js");
            pintrk('load', '${PINTEREST_TAG_ID}');
            pintrk('page');
          `}
        </Script>
      )}

      {/* Microsoft UET Tag */}
      {MICROSOFT_UET_ID && (
        <Script id="microsoft-uets" strategy="lazyOnload">
          {`
            (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:'${MICROSOFT_UET_ID}'};
            o.q=w[u],w[u]=new UET(o),w[u].push('pageLoad')
            },n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
            })(window,document,"script","//bat.bing.com/bat.js","uetq");
          `}
        </Script>
      )}
    </>
  );
}

// Helper functions to track events for various platforms
export function trackEvent(eventName, eventParams = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
}

export function trackFacebookEvent(eventName, eventParams = {}) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, eventParams);
  }
}

export function trackTwitterEvent(eventName, eventParams = {}) {
  if (typeof window !== "undefined" && window.twq) {
    window.twq("track", "Custom", {
      event_name: eventName,
      ...eventParams,
    });
  }
}

export function trackLinkedInEvent(eventName, eventParams = {}) {
  if (typeof window !== "undefined" && window.lintrk) {
    window.lintrk("track", eventName, eventParams);
  }
}

export function trackTikTokEvent(eventName, eventParams = {}) {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(eventName, eventParams);
  }
}

export function trackPinterestEvent(eventName, eventParams = {}) {
  if (typeof window !== "undefined" && window.pintrk) {
    window.pintrk("track", eventName, eventParams);
  }
}

export function trackMicrosoftEvent(eventName, eventParams = {}) {
  if (typeof window !== "undefined" && window.uetq) {
    window.uetq.push({
      ea: eventName,
      ...eventParams,
    });
  }
}
