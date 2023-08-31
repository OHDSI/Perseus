package com.arcadia.DataQualityDashboard.service;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ProcessHolder {

    private Map<Long, Process> processMap = new ConcurrentHashMap<>();

    public void addProcess(Long processId, Process process) {
        processMap.put(processId, process);
    }

    public Process getProcess(Long processId) {
        return processMap.get(processId);
    }

    public void removeProcess(Long processId) {
        processMap.remove(processId);
    }
}

