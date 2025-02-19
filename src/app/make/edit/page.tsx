"use client";
import { useState, useEffect } from "react";
import type { Line } from "@/app/_types/Line";
import { Modal } from "@/app/_components/Modal";
import { v4 as uuid } from "uuid";
import Link from "next/link";

export default function Page() {
  const [lines, setLines] = useState<Line[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [newLineName, setNewLineName] = useState("");
  const [newLineColor, setNewLineColor] = useState("");
  const [newLineId, setNewLineId] = useState("");

  const addLines = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!newLineName) {
        throw new Error("路線名を入力してください");
      }
      if (!newLineColor) {
        throw new Error("路線カラーを入力してください");
      }
      const pattern = /^#[0-9A-Fa-f]{6}$/;
      if (!pattern.test(newLineColor)) {
        throw new Error("カラーコードを正しく入力してください(例:#9A6229)");
      }
      const newLine = {
        id: newLineId,
        name: newLineName,
        color: newLineColor,
        station: [],
      };
      if (lines.find((line) => line.id === newLine.id)) {
        return;
      }
      setLines([...lines, newLine]);
      setIsLineModalOpen(false);
      setNewLineName("");
      setNewLineColor("");
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("不明なエラーが発生しました");
      }
    }
  };

  const updateNewLineName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLineName(e.target.value);
  };

  const updateNewLineColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLineColor(e.target.value);
  };

  return (
    <main className="py-0">
      <table className="min-w-full table-fixed border-collapse border-2 border-slate-800 bg-slate-200">
        <tbody>
          <tr>
            <td className="h-full border-2 border-slate-800 p-0">
              <Link href="/" className="flex size-full">
                <button className="flex-1 px-4 py-1 hover:bg-slate-300 active:bg-slate-400">
                  終了
                </button>
              </Link>
            </td>
            <td className="h-full border-2 border-slate-800 p-0">
              <button className="size-full px-4 py-1 hover:bg-slate-300 active:bg-slate-400">
                背景画像のインポート
              </button>
            </td>
            <td className="h-full border-2 border-slate-800 p-0">
              <button className="size-full px-4 py-1 hover:bg-slate-300 active:bg-slate-400">
                ローカルに保存
              </button>
            </td>
            <td className="h-full border-2 border-slate-800 p-0">
              <button className="size-full px-4 py-1 hover:bg-slate-300 active:bg-slate-400">
                アカウントに保存
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex h-screen">
        <div className="flex-1"></div>
        <div
          className="flex h-full w-[128px] flex-col border-x-2 border-b-2 border-slate-800 
                bg-slate-100 sm:w-[200px] md:w-[300px]"
        >
          <div>
            <div className="p-2 text-lg font-bold">現在の路線</div>
            <div className="flex flex-col items-center justify-center space-y-1 px-2 py-1">
              {lines.map((line, index) => (
                <button
                  key={index}
                  style={{
                    borderColor: line.color,
                  }}
                  className="w-auto max-w-max rounded-lg border-4 bg-white px-4 py-1"
                >
                  {line.name}
                </button>
              ))}
              <button
                className="w-auto max-w-max rounded-md bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700"
                onClick={() => {
                  setIsLineModalOpen(true);
                  setNewLineId(uuid());
                }}
              >
                路線追加
              </button>
            </div>
          </div>
          <div>
            <div className="p-2 text-lg font-bold">現在の駅</div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isLineModalOpen}
        onClose={() => {
          setIsLineModalOpen(false);
          setNewLineName("");
          setNewLineColor("");
          setErrorMessage(null);
        }}
      >
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="lineName" className="block font-bold">
              路線名
            </label>
            <input
              type="text"
              id="lineName"
              name="lineName"
              className="w-full rounded-md border-2 px-2 py-1"
              value={newLineName}
              onChange={updateNewLineName}
              placeholder="路線名を記入してください"
              required
            />
          </div>
          <div>
            <label htmlFor="lineColor" className="block font-bold">
              路線カラー(#RRGGBB)
            </label>
            <input
              type="text"
              id="lineColor"
              name="lineColor"
              className="w-full rounded-md border-2 px-2 py-1"
              value={newLineColor}
              onChange={updateNewLineColor}
              placeholder="路線カラーを記入してください(例:#9A6229)"
              required
            />
          </div>
          {errorMessage && (
            <div className="text-sm text-red-500">{errorMessage}</div>
          )}
          <div className="flex justify-between">
            <button
              className="w-auto max-w-max rounded-md bg-red-500 px-4 py-1 font-bold text-white hover:bg-red-600 active:bg-red-700"
              onClick={() => {
                setIsLineModalOpen(false);
                setNewLineName("");
                setNewLineColor("");
                setErrorMessage(null);
              }}
            >
              キャンセル
            </button>
            <button
              className={
                "w-auto max-w-max rounded-md bg-indigo-500 px-4 py-1 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
              }
              onClick={(e) => {
                addLines(e);
              }}
            >
              追加
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
