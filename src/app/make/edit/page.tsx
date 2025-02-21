"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Line } from "@/app/_types/Line";
import type { Station } from "@/app/_types/Station";
import { Modal } from "@/app/_components/Modal";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import {
  faArrowDown,
  faArrowUp,
  faBars,
  faGear,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { stat } from "fs";

export default function Page() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [addOrEdit, setAddOrEdit] = useState<"追加" | "編集">("追加");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [newLineName, setNewLineName] = useState("");
  const [newLineColor, setNewLineColor] = useState("");
  const [newLineId, setNewLineId] = useState("");
  const [isLineRing, setIsLineRing] = useState(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [newStationName, setNewStationName] = useState("");
  const [newStationPos, setNewStationPos] = useState<
    [number | string, number | string]
  >(["", ""]);
  const [newStationScale, setNewStationScale] = useState(0);
  const [newStationId, setNewStationId] = useState("");
  const [isStationOfLineModalOpen, setIsStationOfLineModalOpen] =
    useState(false);
  const [selectedLineId, setSelectedLineId] = useState("");
  const [isAddStation2LineModalOpen, setIsAddStation2LineModalOpen] =
    useState(false);
  const radioButtons = ["小", "中", "大"];

  const lineInitialization = () => {
    setIsLineModalOpen(false);
    setNewLineName("");
    setNewLineColor("");
    setIsLineRing(false);
    setErrorMessage(null);
  };

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
      const newLine: Line = {
        id: newLineId,
        name: newLineName,
        color: newLineColor,
        station: [],
        ring: isLineRing,
      };
      if (lines.find((line) => line.id === newLine.id)) {
        const updatedLines = lines.map((line) => {
          if (line.id === newLine.id) {
            return newLine;
          }
          return line;
        });
        setLines(updatedLines);
        lineInitialization();
        return;
      }
      setLines([...lines, newLine]);
      lineInitialization();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("不明なエラーが発生しました");
      }
    }
  };

  const ringUpdate = (
    e: React.ChangeEvent<HTMLInputElement>,
    lineId: string
  ) => {
    const updatedLines = lines.map((line) => {
      if (line.id === lineId) {
        return {
          ...line,
          ring: e.target.checked,
        };
      }
      return line;
    });
    setLines(updatedLines);
  };

  const deleteLine = (
    e: React.MouseEvent<HTMLButtonElement>,
    deleteLineId: string
  ) => {
    if (lines.find((line) => line.id === deleteLineId)) {
      const updatedLines = lines.filter((line) => line.id !== deleteLineId);
      setLines(updatedLines);
    }
    lineInitialization();
  };

  const stationInitialization = () => {
    setIsStationModalOpen(false);
    setNewStationName("");
    setNewStationPos(["", ""]);
    setNewStationScale(0);
    setErrorMessage(null);
  };

  const addStations = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!newStationName) {
        throw new Error("駅名を入力してください");
      }
      if (!newStationPos[0] || !newStationPos[1]) {
        throw new Error("駅位置を入力してください");
      }
      const newStation: Station = {
        id: newStationId,
        name: newStationName,
        pos: newStationPos.map((p) => p ?? 0) as [number, number],
        scale: newStationScale,
      };
      if (stations.find((station) => station.id === newStation.id)) {
        const updatedStations = stations.map((station) => {
          if (station.id === newStation.id) {
            return newStation;
          }
          return station;
        });
        setStations(updatedStations);
        stationInitialization();
        return;
      }
      setStations([...stations, newStation]);
      stationInitialization();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("不明なエラーが発生しました");
      }
    }
  };

  const deleteStation = (
    e: React.MouseEvent<HTMLButtonElement>,
    deleteStationId: string
  ) => {
    if (stations.find((station) => station.id === deleteStationId)) {
      const updatedStations = stations.filter(
        (station) => station.id !== deleteStationId
      );
      setStations(updatedStations);
    }
    stationInitialization();
  };

  const updateNewLineName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLineName(e.target.value);
  };

  const updateNewLineColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLineColor(e.target.value);
  };

  const updateNewStationName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStationName(e.target.value);
  };

  const updateScale = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setNewStationScale(index);
  };

  const updateNewStationPos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = e.target.id === "stationPosX" ? 0 : 1;
    const pattern = /^-?[0-9]*$/;
    const inputValue = e.target.value;
    const isValidNumber = inputValue === "-" || pattern.test(inputValue);
    const newValue =
      inputValue === "-" || isNaN(parseInt(inputValue))
        ? inputValue
        : e.target.value;
    if (!isValidNumber && inputValue !== "") {
      setErrorMessage("数値を入力してください");
      return;
    } else {
      setErrorMessage("");
    }
    setNewStationPos([
      index === 0 ? newValue : newStationPos[0],
      index === 1 ? newValue : newStationPos[1],
    ]);
  };

  const addStation2Line = (
    e: React.MouseEvent<HTMLButtonElement>,
    lineId: string,
    stationId: string
  ) => {
    e.preventDefault();
    const updatedLines = lines.map((line) => {
      if (line.id === lineId) {
        return {
          ...line,
          station: [...line.station, stationId],
        };
      }
      return line;
    });
    setLines(updatedLines);
    setIsAddStation2LineModalOpen(false);
  };

  const deleteStation2Line = (
    e: React.MouseEvent<HTMLButtonElement>,
    stationId: string
  ) => {
    e.preventDefault();
    const updatedLines = lines.map((line) => {
      return {
        ...line,
        station: line.station.filter((station) => station !== stationId),
      };
    });
    setLines(updatedLines);
  };

  const replaceStation2Line = (
    e: React.MouseEvent<HTMLButtonElement>,
    stationId: string,
    frontOrBack: number
  ) => {
    e.preventDefault();
    const updatedLines: Line[] = lines.map((line) => {
      if (line.id === selectedLineId) {
        const newStation = [...line.station];
        line.station.map((station, index) => {
          if (station === stationId) {
            [newStation[index], newStation[index + frontOrBack]] = [
              newStation[index + frontOrBack],
              newStation[index],
            ];
          }
          return { ...line, station: newStation };
        });
        return { ...line, station: newStation };
      } else {
        return line;
      }
    });
    setLines(updatedLines);
  };

  return (
    <main className="flex-1">
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
      <div className="flex h-full">
        <div className="flex-1"></div>
        <div
          className="flex h-screen w-[128px] flex-col border-x-2 border-slate-800 
                bg-slate-100 sm:w-[200px] md:w-[300px]"
        >
          <div>
            <div className="p-2 text-lg font-bold">現在の路線</div>
            <div className="flex max-h-40 flex-col items-center justify-start space-y-1 overflow-auto px-2 py-1">
              {lines.map((line, index) => (
                <div
                  key={index}
                  style={{
                    borderColor: line.color,
                  }}
                  className="flex w-full items-center justify-between rounded-lg border-4 bg-white"
                >
                  <div className="px-2 py-1">{line.name}</div>
                  <div className="flex space-x-1 px-1">
                    <button
                      className="text-black hover:text-slate-700 active:text-slate-500"
                      onClick={() => {
                        setIsStationOfLineModalOpen(true);
                        setIsLineRing(line.ring);
                        setSelectedLineId(line.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faBars} className="mr-1" />
                    </button>
                    <button
                      className="text-black hover:text-slate-700 active:text-slate-500"
                      onClick={() => {
                        setIsLineModalOpen(true);
                        setAddOrEdit("編集");
                        setNewLineId(line.id);
                        setNewLineName(line.name);
                        setNewLineColor(line.color);
                        setIsLineRing(line.ring);
                      }}
                    >
                      <FontAwesomeIcon icon={faGear} className="mr-1" />
                    </button>
                    <button
                      className="text-black hover:text-slate-700 active:text-slate-500"
                      onClick={(e) => {
                        deleteLine(e, line.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center">
              <button
                className="w-auto max-w-max rounded-md bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700"
                onClick={() => {
                  setIsLineModalOpen(true);
                  setAddOrEdit("追加");
                  setNewLineId(uuid());
                }}
              >
                路線追加
              </button>
            </div>
          </div>
          <div>
            <div className="p-2 text-lg font-bold">現在の駅</div>
            <div className="flex max-h-40 flex-col items-center justify-start space-y-1 overflow-auto px-2 py-1">
              {stations.map((station, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-between rounded-lg border-4 border-slate-400 bg-white"
                >
                  <div className="px-2 py-1">{station.name}</div>
                  <div className="flex space-x-1 px-1">
                    <button
                      className="text-black hover:text-slate-700 active:text-slate-500"
                      onClick={() => {
                        setIsStationModalOpen(true);
                        setAddOrEdit("編集");
                        setNewStationId(station.id);
                        setNewStationName(station.name);
                        setNewStationPos(station.pos);
                        setNewStationScale(station.scale);
                      }}
                    >
                      <FontAwesomeIcon icon={faGear} className="mr-1" />
                    </button>
                    <button
                      className="text-black hover:text-slate-700 active:text-slate-500"
                      onClick={(e) => {
                        deleteStation(e, station.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-center">
              <button
                className="w-auto max-w-max rounded-md bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700"
                onClick={() => {
                  setIsStationModalOpen(true);
                  setNewStationId(uuid());
                }}
              >
                駅追加
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isLineModalOpen}
        onClose={() => {
          lineInitialization();
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
            <label htmlFor="lineColor" className="flex items-center font-bold">
              路線カラー(#RRGGBB)
              <div
                style={{
                  backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(newLineColor)
                    ? newLineColor
                    : "#000000",
                }}
                className=" mt-1 size-4"
              />
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
                lineInitialization();
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
              {addOrEdit}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isStationModalOpen}
        onClose={() => {
          stationInitialization();
        }}
      >
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="stationName" className="block font-bold">
              駅名
            </label>
            <input
              type="text"
              id="stationName"
              name="stationName"
              className="w-full rounded-md border-2 px-2 py-1"
              value={newStationName}
              onChange={updateNewStationName}
              placeholder="駅名を記入してください"
              required
            />
          </div>
          <div>
            <div className="block font-bold">駅位置</div>
            <label htmlFor="stationPosX">x:</label>
            <input
              type="text"
              id="stationPosX"
              name="stationPosX"
              className="w-full rounded-md border-2 px-2 py-1"
              value={newStationPos[0]}
              onChange={updateNewStationPos}
              placeholder="x座標を記入してください"
              required
            />
            <label htmlFor="stationPosY">z:</label>
            <input
              type="text"
              id="stationPosY"
              name="stationPosY"
              className="w-full rounded-md border-2 px-2 py-1"
              value={newStationPos[1]}
              onChange={updateNewStationPos}
              placeholder="z座標を記入してください"
              required
            />
          </div>
          <div className="block font-bold">駅規模</div>
          <div className="flex space-x-4">
            {radioButtons.map((label: string, index: number) => (
              <div className="" key={label}>
                <input
                  type="radio"
                  name="size"
                  id={`radio-${label}`}
                  value={label}
                  checked={newStationScale === index}
                  onChange={(e) => updateScale(e, index)}
                  className="size-3"
                />
                <label htmlFor={`radio-${label}`}>{label}</label>
              </div>
            ))}
          </div>
          {errorMessage && (
            <div className="text-sm text-red-500">{errorMessage}</div>
          )}
          <div className="flex justify-between">
            <button
              className="w-auto max-w-max rounded-md bg-red-500 px-4 py-1 font-bold text-white hover:bg-red-600 active:bg-red-700"
              onClick={() => {
                stationInitialization();
              }}
            >
              キャンセル
            </button>
            <button
              className={
                "w-auto max-w-max rounded-md bg-indigo-500 px-4 py-1 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
              }
              onClick={(e) => {
                addStations(e);
              }}
            >
              {addOrEdit}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isStationOfLineModalOpen}
        onClose={() => {
          setIsStationOfLineModalOpen(false);
          setIsLineRing(false);
        }}
      >
        <div className="flex flex-col space-y-4">
          <div>
            <div className="flex flex-row space-x-2">
              <div className="font-bold">駅一覧</div>
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="ringCheckbox"
                  checked={isLineRing}
                  onChange={(e) => {
                    setIsLineRing(!isLineRing);
                    ringUpdate(e, selectedLineId);
                  }}
                  className="size-4 accent-indigo-500"
                />
                <label htmlFor="ringCheckbox" className="">
                  環状化する
                </label>
              </div>
            </div>
            <div className="flex max-h-40 flex-col space-y-2 overflow-auto py-2">
              {lines
                .find((line) => selectedLineId === line.id)
                ?.station.map((stationId: string, index: number) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between rounded-lg border-4 border-slate-400 px-2 py-1"
                  >
                    <div>
                      {stations.find((station) => station.id === stationId)
                        ?.name || ""}
                    </div>
                    <div>
                      <button
                        className="text-black hover:text-slate-700 active:text-slate-500 disabled:text-slate-300"
                        disabled={index === 0}
                        onClick={(e) => {
                          replaceStation2Line(e, stationId, -1);
                        }}
                      >
                        <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                      </button>
                      <button
                        className="text-black hover:text-slate-700 active:text-slate-500 disabled:text-slate-300"
                        disabled={
                          index ===
                          (lines.find((line) => selectedLineId === line.id)
                            ?.station.length ?? 0) -
                            1
                        }
                        onClick={(e) => {
                          replaceStation2Line(e, stationId, 1);
                        }}
                      >
                        <FontAwesomeIcon icon={faArrowDown} className="mr-1" />
                      </button>
                      <button
                        className="text-black hover:text-slate-700 active:text-slate-500"
                        onClick={(e) => {
                          deleteStation2Line(e, stationId);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      </button>
                    </div>
                  </div>
                )) || <div />}
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <button
                className="w-auto max-w-max rounded-md bg-indigo-500 px-4 py-1 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
                onClick={() => setIsAddStation2LineModalOpen(true)}
              >
                駅を追加
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              className="w-auto max-w-max rounded-md bg-indigo-500 px-4 py-1 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
              onClick={() => {
                setIsStationOfLineModalOpen(false);
                setIsLineRing(false);
              }}
            >
              終了する
            </button>
          </div>
        </div>
        <Modal
          isOpen={isAddStation2LineModalOpen}
          onClose={() => setIsAddStation2LineModalOpen(false)}
        >
          <div className="block font-bold">駅を選択</div>
          <div className="flex max-h-40 flex-col items-center justify-start space-y-2 overflow-auto">
            {stations.map((station, index) => (
              <button
                key={index}
                className="w-auto max-w-max rounded-lg border-4 border-slate-400 px-4 py-1 hover:border-slate-500 active:border-slate-600"
                onClick={(e) => addStation2Line(e, newLineId, station.id)}
              >
                {station.name}
              </button>
            ))}
          </div>
          <div className="mr-3 flex justify-center">
            <button
              className="mt-2 w-auto max-w-max rounded-md bg-red-500 px-4 py-1 font-bold text-white hover:bg-red-600 active:bg-red-700"
              onClick={() => setIsAddStation2LineModalOpen(false)}
            >
              キャンセル
            </button>
          </div>
        </Modal>
      </Modal>
    </main>
  );
}
