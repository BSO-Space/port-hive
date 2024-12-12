"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Port {
    port: number;
    purpose: string;
    addedBy: string;
    status: string;
}

const PortList: React.FC = () => {
    const [ports, setPorts] = useState<Port[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [portsPerPage, setPortsPerPage] = useState<number | "all">(10);
    const [sortField, setSortField] = useState<keyof Port>("port");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const [editingPort, setEditingPort] = useState<number | null>(null);
    const [editedPurpose, setEditedPurpose] = useState<string>("");
    const [editedAddedBy, setEditedAddedBy] = useState<string>("");

    useEffect(() => {
        const fetchPorts = async () => {
            try {
                const response = await axios.get("/api/ports/in-use");
                setPorts((response.data as { ports: Port[] }).ports);
            } catch (error) {
                console.error("Error fetching ports:", error);
            }
        };
        fetchPorts();
    }, []);

    const sortedPorts = [...ports].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const totalPages =
        portsPerPage === "all" ? 1 : Math.ceil(ports.length / (portsPerPage as number));
    const currentPorts =
        portsPerPage === "all"
            ? sortedPorts
            : sortedPorts.slice(
                  (currentPage - 1) * (portsPerPage as number),
                  currentPage * (portsPerPage as number)
            );

    const toggleSort = (field: keyof Port) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const startEditing = (portNumber: number, currentPurpose: string, currentAddedBy: string) => {
        setEditingPort(portNumber);
        setEditedPurpose(currentPurpose);
        setEditedAddedBy(currentAddedBy);
    };

    const cancelEditing = () => {
        setEditingPort(null);
        setEditedPurpose("");
        setEditedAddedBy("");
    };

    const saveChanges = async (portNumber: number) => {
        try {
            await axios.post("/api/ports/update-info", {
                port: portNumber,
                purpose: editedPurpose,
                addedBy: editedAddedBy,
            });

            // Update local state
            setPorts((prevPorts) =>
                prevPorts.map((p) =>
                    p.port === portNumber
                        ? { ...p, purpose: editedPurpose, addedBy: editedAddedBy }
                        : p
                )
            );
            setEditingPort(null);
            setEditedPurpose("");
            setEditedAddedBy("");
        } catch (error) {
            console.error("Error updating port info:", error);
        }
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="text-center">Active Ports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    <Select
                        onValueChange={(value) =>
                            setPortsPerPage(value === "all" ? "all" : Number(value))
                        }
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue
                                placeholder={`${
                                    portsPerPage === "all" ? "All" : portsPerPage
                                }`}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {["10", "20", "30", "all"].map((limit) => (
                                <SelectItem key={limit} value={limit}>
                                    {limit === "all" ? "All" : `${limit}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {["port", "purpose", "addedBy", "status", "actions"].map((field) => (
                                    <TableHead
                                        key={field}
                                        className={`text-center ${
                                            field !== "actions" ? "cursor-pointer" : ""
                                        }`}
                                        onClick={
                                            field !== "actions"
                                                ? () => toggleSort(field as keyof Port)
                                                : undefined
                                        }
                                    >
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                        {sortField === field &&
                                            (sortOrder === "asc" ? " ↑" : " ↓")}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentPorts.map((port) => (
                                <TableRow key={port.port}>
                                    <TableCell className="text-center">{port.port}</TableCell>
                                    <TableCell>
                                        {editingPort === port.port ? (
                                            <Input
                                                type="text"
                                                value={editedPurpose}
                                                onChange={(e) => setEditedPurpose(e.target.value)}
                                            />
                                        ) : (
                                            port.purpose || "Not specified"
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {editingPort === port.port ? (
                                            <Input
                                                type="text"
                                                value={editedAddedBy}
                                                onChange={(e) => setEditedAddedBy(e.target.value)}
                                            />
                                        ) : (
                                            port.addedBy
                                        )}
                                    </TableCell>
                                    <TableCell className="flex justify-center items-center gap-1">
                                        <span
                                            className={`w-3 h-3 rounded-full ${
                                                port.status === "active"
                                                    ? "bg-green-500"
                                                    : "bg-yellow-500"
                                            }`}
                                        />
                                        {port.status}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {editingPort === port.port ? (
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => saveChanges(port.port)}
                                                >
                                                    Save
                                                </Button>
                                                <Button variant="outline" onClick={cancelEditing}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    startEditing(port.port, port.purpose || "", port.addedBy)
                                                }
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {portsPerPage !== "all" && (
                    <div className="flex justify-between items-center mt-3 text-sm">
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            variant="outline"
                        >
                            Previous
                        </Button>
                        <p>
                            Page {currentPage} of {totalPages}
                        </p>
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            variant="outline"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PortList;