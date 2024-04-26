import React from 'react';
import ProgressService from '../feedbacks/ProgressService';

export default function InfiniteScroll(props) {
  const { onInfiniteScroll, loading, loadingText, loadingSpinner } = props;

  const loader = React.useRef(null);

  const handleObserver = (entries) => {
    const target = entries[0];
    console.log('isScrolling...');
    if (target.isIntersecting) {
      try {
        if (onInfiniteScroll != undefined) onInfiniteScroll();
      } catch (error) {
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  return (
    <div className="infinite_scroll_block" ref={loader}>
      {loading && <ProgressService type={loadingSpinner} />}
    </div>
  );
}
