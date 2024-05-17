const styles = {
  html: {
    height: '100%',
    backgroundColor: 'rgba(240, 130, 130, 0.61)',
    zIndex: '-10'
  },
  body: {
    margin: '0',
    height: '100%',
    backgroundColor: 'rgba(240, 130, 130, 0.61)',
    zIndex: '-10'
  },
  heartbeatloader: {
    position: 'absolute',
    width: '20vmin',
    height: '20vmin',
    zIndex: '-2',
    margin: 'auto',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },
  svgdraw: {
    top: '0px',
    left: '0px',
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: 'scale(1.4)',
    zIndex: '3'
  },
  path: {
    stroke: 'rgba(3, 3, 3, 0.95)',
    strokeWidth: '4',
    strokeDasharray: '1000px',
    strokeDashoffset: '1000px',
    animation: 'draw 1.5s infinite forwards normal linear',
    animationDelay: '0.1s',
    position: 'relative'
  },
  innercircle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'rgba(209, 28, 28, 0.705)',
    position: 'absolute',
    zIndex: '1',
    margin: 'auto',
    top: '0',
    opacity: '0.9',
    animation: 'innerbeat 1.5s infinite linear forwards'
  },
  outercircle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'rgba(230, 92, 92, 0.774)',
    boxShadow: '0 0 40px 20px #fff',
    position: 'absolute',
    zIndex: '-1',
    opacity: '0.9',
    top: '0',
    left: '0',
    transform: 'scale(1.2)',
    animation: 'outerbeat 1.5s infinite linear forwards'
  }
};

const HeartbeatLoader = () => {
  return (
    <>
      <style>
        {`
          @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes innerbeat {
            0% {transform: scale(1);}
            10% {transform: scale(1);}
            50% {transform: scale(1.15);}
            60% {transform: scale(1.05);}
            75% {transform: scale(1.2);}
          }
          @keyframes outerbeat {
            0% {transform: scale(1.2);}
            10% {transform: scale(1.2);}
            50% {transform: scale(1.3);}
            60% {transform: scale(1.25);}
            75% {transform: scale(1.3);}
          }
        `}
      </style>
      <div style={styles.heartbeatloader}>
        <svg style={styles.svgdraw} width="100%" height="100%" viewBox="0 0 150 400" xmlns="http://www.w3.org/2000/svg">
          <path style={styles.path} d="M 0 200 l 40 0 l 5 -40 l 5 40 l 10 0 l 5 15 l 10 -140 l 10 220 l 5 -95 l 10 0 l 5 20 l 5 -20 l 30 0" fill="transparent" strokeWidth="4" stroke="black"/>
        </svg>
        <div style={styles.innercircle}></div>
        <div style={styles.outercircle}></div>
      </div>
    </>
  );
};

export default HeartbeatLoader;
