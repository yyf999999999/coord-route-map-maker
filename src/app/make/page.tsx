"use client";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <div className="flex w-full justify-center py-4 text-4xl font-bold">
        作る
      </div>

      <div className="flex items-stretch justify-between space-x-10">
        <div className="flex w-1/2 flex-col items-center space-y-5">
          <div className="text-6xl font-bold">新規作成</div>
          <div>1から路線図を作り始めます</div>
          <Link href="/make/edit">
            <button className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700">
              始める
            </button>
          </Link>
        </div>

        <div className="w-[2px] bg-gray-400"></div>

        <div className="flex w-1/2 flex-col items-center space-y-5">
          <div className="text-6xl font-bold">編集</div>
          <div>既に作ってある路線図を読み込む</div>
          <button className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700">
            ローカルから読み込む
          </button>
          <button className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700">
            アカウントから読み込む
          </button>
        </div>
      </div>

      <Link href="/">
        <button className="rounded-md bg-green-500 px-4 py-1 text-white hover:bg-green-600 active:bg-green-700">
          ホームに戻る
        </button>
      </Link>
    </main>
  );
}
