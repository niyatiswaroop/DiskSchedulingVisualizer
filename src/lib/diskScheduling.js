/**
 * PerformanceMetrics {
 *   totalSeekTime: number,
 *   seekCount: number,
 *   averageSeekTime: number,
 *   path: number[]
 * }
 *
 * Algorithm = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK'
 */

/** First Come First Serve */
export function fcfs(requests, head) {
  let totalSeek = 0;
  let seekCount = 0;
  const path = [head];
  let currentHead = head;

  for (const request of requests) {
    totalSeek += Math.abs(currentHead - request);
    currentHead = request;
    path.push(currentHead);
    seekCount++;
  }

  return {
    totalSeekTime: totalSeek,
    seekCount,
    averageSeekTime: totalSeek / seekCount,
    path,
  };
}

/** Shortest Seek Time First */
export function sstf(requests, head) {
  let totalSeek = 0;
  let seekCount = 0;
  const path = [head];
  let currentHead = head;
  const remaining = [...requests];

  while (remaining.length > 0) {
    let minDist = Infinity;
    let minIndex = -1;

    remaining.forEach((request, index) => {
      const dist = Math.abs(currentHead - request);
      if (dist < minDist) {
        minDist = dist;
        minIndex = index;
      }
    });

    totalSeek += minDist;
    currentHead = remaining[minIndex];
    path.push(currentHead);
    remaining.splice(minIndex, 1);
    seekCount++;
  }

  return {
    totalSeekTime: totalSeek,
    seekCount,
    averageSeekTime: totalSeek / seekCount,
    path,
  };
}

/** SCAN (elevator) */
export function scan(requests, head, diskSize, direction = 'left') {
  let totalSeek = 0;
  const path = [head];
  const left = [];
  const right = [];

  requests.forEach((req) => {
    if (req < head) left.push(req);
    else right.push(req);
  });

  left.sort((a, b) => b - a);
  right.sort((a, b) => a - b);

  if (direction === 'left') {
    for (const req of left) {
      totalSeek += Math.abs(head - req);
      head = req;
      path.push(head);
    }
    if (left.length > 0 && head !== 0) {
      totalSeek += head;
      head = 0;
      path.push(0);
    }
    for (const req of right) {
      totalSeek += Math.abs(head - req);
      head = req;
      path.push(head);
    }
  } else {
    for (const req of right) {
      totalSeek += Math.abs(head - req);
      head = req;
      path.push(head);
    }
    if (right.length > 0 && head !== diskSize - 1) {
      totalSeek += (diskSize - 1) - head;
      head = diskSize - 1;
      path.push(diskSize - 1);
    }
    for (const req of left) {
      totalSeek += Math.abs(head - req);
      head = req;
      path.push(head);
    }
  }

  return {
    totalSeekTime: totalSeek,
    seekCount: requests.length,
    averageSeekTime: totalSeek / requests.length,
    path,
  };
}

/** C-SCAN (circular scan) */
export function cscan(requests, head, diskSize) {
  let totalSeek = 0;
  const path = [head];
  const left = [];
  const right = [];

  requests.forEach((req) => {
    if (req < head) left.push(req);
    else right.push(req);
  });

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  for (const req of right) {
    totalSeek += Math.abs(head - req);
    head = req;
    path.push(head);
  }

  if (left.length > 0) {
    if (head !== diskSize - 1) {
      totalSeek += (diskSize - 1) - head;
      head = diskSize - 1;
      path.push(diskSize - 1);
    }
    // jump to start (wrap)
    totalSeek += diskSize - 1;
    head = 0;
    path.push(0);
  }

  for (const req of left) {
    totalSeek += Math.abs(head - req);
    head = req;
    path.push(head);
  }

  return {
    totalSeekTime: totalSeek,
    seekCount: requests.length,
    averageSeekTime: totalSeek / requests.length,
    path,
  };
}

/** LOOK */
export function look(requests, head, direction = 'left') {
  let totalSeek = 0;
  const path = [head];
  const left = [];
  const right = [];

  requests.forEach((req) => {
    if (req < head) left.push(req);
    else right.push(req);
  });

  left.sort((a, b) => b - a);
  right.sort((a, b) => a - b);

  if (direction === 'left') {
    for (const req of left) {
      totalSeek += Math.abs(head - req);
      head = req;
      path.push(head);
    }
    for (const req of right) {
      totalSeek += Math.abs(head - req);
      head = req;
      path.push(head);
    }
  } else {
    for (const req of right) {
      totalSeek += Math.abs(head - req);
      head = req;
      path.push(head);
    }
    for (const req of left) {
      totalSeek += Math.abs(head - req);
      head = req;
      path.push(head);
    }
  }

  return {
    totalSeekTime: totalSeek,
    seekCount: requests.length,
    averageSeekTime: totalSeek / requests.length,
    path,
  };
}

/** C-LOOK */
export function clook(requests, head) {
  let totalSeek = 0;
  const path = [head];
  const left = [];
  const right = [];

  requests.forEach((req) => {
    if (req < head) left.push(req);
    else right.push(req);
  });

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  for (const req of right) {
    totalSeek += Math.abs(head - req);
    head = req;
    path.push(head);
  }

  for (const req of left) {
    totalSeek += Math.abs(head - req);
    head = req;
    path.push(head);
  }

  return {
    totalSeekTime: totalSeek,
    seekCount: requests.length,
    averageSeekTime: totalSeek / requests.length,
    path,
  };
}

/** Execute selected algorithm */
export function executeAlgorithm(algorithm, requests, head, diskSize, direction = 'left') {
  switch (algorithm) {
    case 'FCFS':
      return fcfs(requests, head);
    case 'SSTF':
      return sstf(requests, head);
    case 'SCAN':
      return scan(requests, head, diskSize, direction);
    case 'C-SCAN':
      return cscan(requests, head, diskSize);
    case 'LOOK':
      return look(requests, head, direction);
    case 'C-LOOK':
      return clook(requests, head);
    default:
      return fcfs(requests, head);
  }
}
