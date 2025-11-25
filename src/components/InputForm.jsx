import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, RotateCcw, Gauge } from "lucide-react";

export const InputForm = ({ onSubmit, onReset, isAnimating, animationSpeed, onSpeedChange }) => {
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [requests, setRequests] = useState("98, 183, 37, 122, 14, 124, 65, 67");
  const [head, setHead] = useState("53");
  const [diskSize, setDiskSize] = useState("200");
  const [direction, setDirection] = useState("left");

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestArray = requests
      .split(",")
      .map((r) => parseInt(r.trim()))
      .filter((n) => !isNaN(n));
    const headPos = parseInt(head);
    const diskSizeNum = parseInt(diskSize);

    if (requestArray.length === 0 || isNaN(headPos) || isNaN(diskSizeNum)) {
      alert("Please enter valid values");
      return;
    }

    // Validate disk size
    if (diskSizeNum <= 0) {
      alert("Disk size must be greater than 0");
      return;
    }

    // Validate head position is within bounds [0, diskSize-1]
    if (headPos < 0 || headPos >= diskSizeNum) {
      alert(`Head position must be between 0 and ${diskSizeNum - 1}`);
      return;
    }

    // Validate all requests are within bounds [0, diskSize-1]
    const invalidRequests = requestArray.filter((r) => r < 0 || r >= diskSizeNum);
    if (invalidRequests.length > 0) {
      alert(
        `Invalid requests: ${invalidRequests.join(", ")}. All requests must be between 0 and ${
          diskSizeNum - 1
        }`,
      );
      return;
    }

    onSubmit({
      algorithm,
      requests: requestArray,
      head: headPos,
      diskSize: diskSizeNum,
      direction,
    });
  };

  return (
    <Card className="p-6 bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="algorithm">Algorithm</Label>
            <Select value={algorithm} onValueChange={(value) => setAlgorithm(value)}>
              <SelectTrigger id="algorithm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="FCFS">FCFS (First Come First Serve)</SelectItem>
                <SelectItem value="SSTF">SSTF (Shortest Seek Time First)</SelectItem>
                <SelectItem value="SCAN">SCAN (Elevator)</SelectItem>
                <SelectItem value="C-SCAN">C-SCAN (Circular SCAN)</SelectItem>
                <SelectItem value="LOOK">LOOK</SelectItem>
                <SelectItem value="C-LOOK">C-LOOK (Circular LOOK)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="head">
              Initial Head Position (0-{parseInt(diskSize) > 0 ? parseInt(diskSize) - 1 : "N-1"})
            </Label>
            <Input
              id="head"
              type="number"
              min="0"
              max={parseInt(diskSize) > 0 ? parseInt(diskSize) - 1 : undefined}
              value={head}
              onChange={(e) => setHead(e.target.value)}
              placeholder="53"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diskSize">Disk Size (N)</Label>
            <Input
              id="diskSize"
              type="number"
              min="1"
              value={diskSize}
              onChange={(e) => setDiskSize(e.target.value)}
              placeholder="200"
            />
          </div>

          {["SCAN", "LOOK"].includes(algorithm) && (
            <div className="space-y-2">
              <Label htmlFor="direction">Initial Direction</Label>
              <Select value={direction} onValueChange={(value) => setDirection(value)}>
                <SelectTrigger id="direction">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="left">Left (Decreasing)</SelectItem>
                  <SelectItem value="right">Right (Increasing)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="requests">
            Request Queue (comma-separated, 0-{parseInt(diskSize) > 0 ? parseInt(diskSize) - 1 : "N-1"})
          </Label>
          <Input
            id="requests"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="98, 183, 37, 122, 14, 124, 65, 67"
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="speed" className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Animation Speed
            </Label>
            <span className="text-sm text-muted-foreground">
              {animationSpeed}ms ({animationSpeed < 400 ? "Fast" : animationSpeed < 800 ? "Normal" : "Slow"})
            </span>
          </div>
          <Slider
            id="speed"
            min={100}
            max={1500}
            step={50}
            value={[animationSpeed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            disabled={isAnimating}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isAnimating} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Run Algorithm
          </Button>
          <Button type="button" onClick={onReset} variant="outline" disabled={isAnimating}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};
