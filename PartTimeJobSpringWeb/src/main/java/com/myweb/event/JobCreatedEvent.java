/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.event;

import com.myweb.pojo.Job;
import org.springframework.context.ApplicationEvent;

public class JobCreatedEvent extends ApplicationEvent {
    private final Job job;

    public JobCreatedEvent(Object source, Job job) {
        super(source);
        this.job = job;
    }

    public Job getJob() {
        return job;
    }
}
