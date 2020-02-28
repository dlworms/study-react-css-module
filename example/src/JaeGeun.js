import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './JaeGeun.module.scss';
console.table(styles);

const JaeGeun = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);
      const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(posts);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="jaegeun">
      <header className={styles.header}>
        <h1 className={styles.header_title}>Posts</h1>
      </header>
      
      { loading ? (
        <p>Loading . . .</p>
      ) : ( 
        <ul className={styles.post_list}>
          {posts.map(post => (
            <li key={post.id} className={styles.post_item}>
              {post.title}
            </li>
          ))}
        </ul>
      ) }
    </div>
  );
}

export default JaeGeun;
