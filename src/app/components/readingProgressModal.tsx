import React, { useState } from "react";
import { Modal, Button, Timeline } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type ReadingProgressModalProps = {
    createdAt: string | null;
    startReadingAt: string | null;
    endReadingAt: string | null;
    open: boolean; 
    onClose: () => void;
};

const ReadingProgressModal: React.FC<ReadingProgressModalProps> = ({
    open,
    onClose,
    createdAt,
    startReadingAt,
    endReadingAt,
}) => {


    const getRelativeTime = (start: string | null, end: string | null): string => {
        if (!start || !end) return "N/A";
        return dayjs(start).to(dayjs(end));
    };

    return (
        <>
            <Modal
                title="Reading Progress"
                open={open}
                onCancel={onClose}
                footer={null}
            >
                <Timeline
                    items={[
                        {
                            color: "green",
                            children: (
                                <>
                                    <strong>Created At:</strong>{" "}
                                    {createdAt ? dayjs(createdAt).format("YYYY-MM-DD HH:mm") : "Not Available"}
                                </>
                            ),
                        },
                        {
                            color: startReadingAt ? "green" : "red",
                            children: (
                                <>
                                    <strong>Start Reading:</strong>{" "}
                                    {startReadingAt ? dayjs(startReadingAt).format("YYYY-MM-DD HH:mm") : "Not Started"}
                                </>
                            ),
                        },
                        {
                            color: endReadingAt ? "green" : "red",
                            children: (
                                <>
                                    <strong>Completed At:</strong>{" "}
                                    {endReadingAt ? dayjs(endReadingAt).format("YYYY-MM-DD HH:mm") : "Not Completed"}
                                </>
                            ),
                        },
                    ]}
                />


                <div className="mt-4">
                    <strong>Durations:</strong>
                    <ul>
                        <li>
                            From Creation to Start: {getRelativeTime(createdAt, startReadingAt)}
                        </li>
                        <li>
                            From Start to Completion: {getRelativeTime(startReadingAt, endReadingAt)}
                        </li>
                        <li>
                            Total Time: {getRelativeTime(createdAt, endReadingAt)}
                        </li>
                    </ul>
                </div>
            </Modal>
        </>
    );
};

export default ReadingProgressModal;
