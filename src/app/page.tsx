"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <div className="flex w-full justify-center py-4 text-4xl font-bold">
        CoordRouteMapMaker
      </div>

      <div className="flex justify-center">
        <div className="mb-5 w-2/3 rounded-md border-2 border-slate-500 bg-slate-200 px-4 py-1">
          <div className="">
            CoordRouteMapMakerは、座標を入力することで駅や路線を描画していく路線図エディターです。
          </div>
          {/*
          <div className="text-right">
            <button className="rounded-md bg-green-500 px-2 py-1 text-white hover:bg-green-600 active:bg-green-700">
              <FontAwesomeIcon icon={faCircleQuestion} className="mr-1" />
              使い方
            </button>
          </div>*/}
        </div>
      </div>

      <div className="flex items-stretch justify-between space-x-10">
        <div className="flex w-1/2 flex-col items-center space-y-5">
          <div className="text-6xl font-bold">作る</div>
          <div>自分の手で路線図を作ります</div>
          <Link href="/make">
            <button className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700">
              始める
            </button>
          </Link>
        </div>

        <div className="w-[2px] bg-gray-400"></div>

        <div className="flex w-1/2 flex-col items-center space-y-5">
          <div className="text-6xl font-bold">見る</div>
          <div>他の人が作った路線図を閲覧します</div>
          <Link href="/">
            <button className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700">
              始める(未実装)
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
