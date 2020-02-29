# CSS Module
## I. CSS Module 이란?

- 컴포넌트 스타일링에 최적화 된 라이브러리로,
CSS를 컴포넌트 기준으로 고유하게 관리할 수 있도록 모듈화해준다.
- [Create React App 2.0](https://reactjs.org/blog/2018/10/01/create-react-app-v2.html) 부터 기본적으로 제공한다. (작성일 기준 Latest version : 3.3.0)

## II. 특징

- 클래스명에 고유한 해쉬값이 자동으로 생성되어 포함된다.
- 스타일 정의한 컴포넌트 내에서만 유효하기 때문에 클래스명의 중복을 막을 수 있다.
고로 클래스명이 겹칠까 하는 걱정을 덜 수 있다.
- 상황에 맞게 전역으로 사용할 수도 있다.

## III. 적용 방법

1. `scss/css` 파일 확장자를 `[파일이름].scss/css` 에서 `[파일이름].module.scss/css` 로 변경한다. 아래와 같이 스타일 정의를 하였다고 가정하자.
    ```scss
    // JaeGeun.module.scss
    .header {
      display: flex;
      ...
    }
    ```
2. `scss/css` 파일을 가져와, 모듈 객체(예시에서는 styles에 해당)로 포함하도록 `import` 구문을 변경한다.
    ```typescript
    // AS-IS
    import './JaeGeun.scss';

    // TO-BE
    import styles from './JaeGeun.module.scss';
    ```

    이후, `console.table(styles)` 을 통해 styles 객체를 확인해보면 기존 클래스명과,
    CSS Module에 의해 생성된 클래스명( `[파일이름]_[클래스명]__hash값`)이 각각 key와 value의 형태로 생성되는 것을 확인할 수 있다.

    ![Untitled](https://user-images.githubusercontent.com/26413372/75600413-61f12300-5af2-11ea-9527-da432d3528be.png)

    [렌더링 결과]
    ```html
    // AS_IS
    <div class="JaeGeun_header">
      ...
    </div>
    ```
    
    ```html
    // TO_BE
    <div class="JaeGeun_header__1hL0r">
      ...
    </div>
    ```
3. 아래 2가지 방법을 참고하여 클래스를 적용한다.
    - 1개의 클래스를 적용할 경우

        `className="[클래스명]"` 대신 `className={styles.[클래스명]}` 의 객체 리터럴 형식으로 적용한다.
      ```typescript
      import React from 'react';
      import styles from './JaeGeun.module.scss';

      const JaeGeun = () => {
        return (
          <header className={styles.header}>
            ...
          </header>
        )
      };

      export default JaeGeun;
      ```
    - 2개 이상의 클래스를 적용할 경우
        - 템플릿 리터럴 (백틱 문자) 활용
        
        ```typescript
        import React from 'react';
        import styles from './JaeGeun.module.scss';

        const JaeGeun = () => {
          return (
            <div className={`${styles.jaegeun} ${styles.dambi}
              ${this.state.loading ? 'is-loading' : ''}`}>
              ...
            </div>
          )
        };

        export default JaeGeun;
        ```
        [예시 참고] [https://programmingwithmosh.com/react/multiple-css-classes-react/](https://programmingwithmosh.com/react/multiple-css-classes-react/)

        - `classnames` 라이브러리 활용 [[공식문서 바로가기]](https://github.com/JedWatson/classnames)

            객체, 배열 등 다양한 형식으로도 사용이 가능하며, 특히 조건문 처리에 활용하기에 좋다.

            [활용 예시]
            ```
            classNames('jaegeun', 'dambi') // -> 'jaegeun dambi'
            classNames('jaegeun', { 'dambi': true }) // -> 'jaegeun dambi'
            classNames('jaegeun', { 'dambi': false, 'miso': true }) // -> 'jaegeun miso'
            classNames('jaegeun', { 'dambi': false }, 'miso', { 'jiho': false }) // -> 'jaegeun miso'
            classNames('jaegeun', this.state.loading && 'is-loading') // -> this.state.loading이 true일 경우 'jaegeun is-loading'
            ```

            [`classnames` 적용 전]
            ```typescript
            import React from 'react';
            import styles from './JaeGeun.module.scss';

            const JaeGeun = () => {
              const [count, setCount] = useState(0);

              return (
                <div className={`
                  ${styles.jaegeun}
                  ${count === 0 ? styles.dambi : ''}
                  ${count === 1 ? styles.miso : ''}
                  ${isActive ? 'is-active' : ''}
                `}></div>
              );
            }

            export default JaeGeun;
            ```
            [`classnames` 적용 후]

            `bind` 기능과 조건문 처리 방식을 활용하여 좀더 간략화할 수 있다.
            ```typescript
            import React from 'react';
            import classNames from 'classnames/bind';
            import styles from './JaeGeun.module.scss';

            const cx = classNames.bind(styles);

            const JaeGeun = () => {
              const [count, setCount] = useState(0);

              return (
                <div className={cx(
                  'jaegeun',
                  {
                    'dambi': count === 0,
                    'miso': count === 1,
                    'is-active': isActive
                  }
                )}></div>
              );
            }

            export default JaeGeun;
            ```
## IV. `SCSS/CSS` 작성 시 참고사항

- 전역으로 사용되는 공통 스타일 속성은 아래 코드와 같이 `:global()` 선택자로 감싸, 해쉬값이 붙지 않도록 정의한다.
    - reset.css
    - `.blind` 과 같이 재사용 빈도가 높은 클래스
    - Atomic components (Checkbox, Radio, Select 등)
    - @keyframes
    
    ```scss
    // reset 일부
    :global(body), :global(h1), :global(h2), :global(h3), :global(h4), :global(h5), :global(h6),
    :global(p), :global(blockquote), :global(pre), :global(a),
    :global(button), :global(input), :global(fieldset), :global(form), :global(legend),
    :global(dl), :global(dt), :global(dd), :global(ol), :global(ul), :global(li),
    :global(table), :global(th), :global(td), :global(textarea) {
      margin: 0;
      padding: 0;
    }
    :global(ol), :global(ul) {
      list-style: none;
    }

    // .blind
    :global(.blind) {
      position: absolute;
      overflow: hidden;
      clip: rect(0 0 0 0);
      margin: -1px;
      width: 1px;
      height: 1px;
    }

    // keyframes
    @keyframes :global(slideToLeft) {
      0% { transform: translateX(0) }
      100% { transform: translateX(-100%) }
    }
    .character {
      animation: slideToLeft .5s ease-in-out;
    }
    ```
    [참고] [https://github.com/harrysolovay/css-modules-css-reset/blob/master/reset.css](https://github.com/harrysolovay/css-modules-css-reset/blob/master/reset.css)

- 활성화 클래스 정의 시에도 `:global` 문법을 활용하여 정의한다.
예로 `.tooltip_box--3xdqz` 에 활성화 클래스를 적용하고 싶을 경우
    ```scss
    .tooltip_box {
      display: none;
      &:global(.is_active) {
        z-index: 10;
        display: block;
      }
    }
    ```
- 단어 간 구분 시, 대시 기호(`-`)를 사용할 경우 에러가 발생하므로 밑줄 문자(`_`)를 사용한다.
(예: `.jaegeun_header`)
