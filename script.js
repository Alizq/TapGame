enchant();

window.onload = function () {
	const game = new Game(400, 500);  				//screenSize

	/////////////////////////////////////////////////
	


	//click sound
	const clickSndUrl = "click.wav";		//game.html
	game.preload([clickSndUrl]); 			//データ

	//png
	const zoyamaImgUrl = "kanade.png";		//game.html
	game.preload([zoyamaImgUrl]);			//データ

	//retry
	const retryImgUrl = "retry.png";		//game.html
	game.preload([retryImgUrl]);			//データ

	//tweet
	const tweetImgUrl = "server.png";	    //game.html
	game.preload([tweetImgUrl]);		    //データ		

	//読み込み
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 

		let point = 0;									//ポイント
		let state = 0;								//現在のゲーム状態

		//グローバル変数終わり
		/////////////////////////////////////////////////



		const mainScene = new Scene();					//シーン作成
		game.pushScene(mainScene);  					//mainSceneシーンオブジェクトを画面に設置
		mainScene.backgroundColor = "black"; 			//mainSceneシーンの背景は黒くした

		//ポイント表示テキスト
		const scoreText = new Label(); 					//テキストはLabelクラス
		scoreText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		scoreText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		scoreText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		scoreText.moveTo(0, 30);						//移動位置指定
		mainScene.addChild(scoreText);					//mainSceneシーンにこの画像を埋め込む

		scoreText.text = "Now：" + point;					//テキストに文字表示 Pointは変数なので、ここの数字が増える

		//ボタン
		const zoyamaImg = new Sprite(166, 168);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		zoyamaImg.moveTo(118, 100);						//画像ボタンの位置
		zoyamaImg.image = game.assets[zoyamaImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		mainScene.addChild(zoyamaImg);					//mainSceneにこのぞう山画像を貼り付ける  

		zoyamaImg.ontouchend = function () {				//ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			point++;									//Pointを1増やす
			game.assets[clickSndUrl].clone().play();		//クリックの音を鳴らす。

			//クリックしたので画像のｘ位置を戻す
			this.x = -200;							//this.xって何？と思った方、Zoyamaの関数内で画像の座標を動かすときにはthisを使います。

			//ポイントによって状態Stateを変更する
			if (point < 3) {
				state = 1;
			} else if (point < 6) {
				state = 2;
			} else if (point < 9) {
				state = 3;
			} else if (point < 12) {
				state = 4;
			} else {
				state = 5;
			}

		};



		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe = function () {
			if (state == 0) { 							//state=0のとき、初期セット状態(Pointの状態を０にして)
				zoyamaImg.x = -200;						//画像のｘ座標を指定
				zoyamaImg.y = 100;						//画像のy座標を指定
				point = 0;  							//point初期化
				state = 1;							//ゲームスタート状態に移行
			}
			if (state == 1) {							//ゲームスタート　状態１
				zoyamaImg.x += 10;
			}
			if (state == 2) {							//状態２（point３以上なら）
				zoyamaImg.x += 20;
			}
			if (state == 3) {							//状態３（point６以上から）
				zoyamaImg.x += 30;
				zoyamaImg.y = 150 + Math.sin(zoyamaImg.x / 60) * 100; // ｙ座標を振幅100pxのサイン波で移動(Sinは便利なので慣れとくといいで)
			}
			if (state == 4) {							//状態４（point９以上から）　4は初期セット状態（state=4）と移動状態（state=4.1)の2つに状態をわける		
				zoyamaImg.y = Math.random() * 400;			//ｙ座標の位置をランダムに決定
				state = 4.1;
			}
			if (state == 4.1) {							//状態４．１ 移動状態
				zoyamaImg.x += 15;						//ただ移動します
			}
			if (state == 5) {							//状態５（point１２以上から）　 ｙ軸が毎フレーム毎に変化する
				zoyamaImg.x += 25;						//移動します。
				zoyamaImg.y = Math.random() * 100;			//ｙ座標の位置を枚フレーム毎にランダム決定
			}

			//現在のテキスト表示
			scoreText.text = "Now：" + point; 				//point変数が変化するので、毎フレームごとにpointの値を読み込んだ文章を表示する

			//ゲームオーバー判定
			if (zoyamaImg.x >= 400) {						//画面端に画像画像が行ってしまったら
				game.popScene();					//mainSceneシーンを外す
				game.pushScene(endScene);				//endSceneシーンを読み込ませる

				//ゲームオーバー後のテキスト表示
				gameOverText.text = "げーむおーばーwwww  " + point + "枚";				//テキストに文字表示 
			}

		};



		////////////////////////////////////////////////////////////////
		//結果画面
		const endScene = new Scene();
		endScene.backgroundColor = "blue";

		//GAMEOVER
		const gameOverText = new Label(); 					//テキストはLabelクラス
		gameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		gameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		gameOverText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		gameOverText.moveTo(0, 30);						//移動位置指定
		endScene.addChild(gameOverText);						//endSceneシーンにこの画像を埋め込む



		//リトライボタン
		const retryBtn = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		retryBtn.moveTo(50, 300);						//リトライボタンの位置
		retryBtn.image = game.assets[retryImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(retryBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		retryBtn.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			state = 0;
			game.popScene();						//endSceneシーンを外す
			game.pushScene(mainScene);					//mainSceneシーンを入れる
		};

		
		const tweetBtn = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		tweetBtn.moveTo(230, 300);						//リトライボタンの位置
		tweetBtn.image = game.assets[tweetImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(tweetBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		tweetBtn.ontouchend = function () {			
			window.open("https://discord.gg/jqS2jDTPkC"); //私のserverが出てくる
		};

	};
	game.start();
};
