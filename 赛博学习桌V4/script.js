const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://你的生产环境域名';

let pomodoroInterval;
let isPomodoroActive = false;
let timeLeft = 1500; // 25分钟
let isBreakTime = false;
let totalPomodoros = 0;

// 存储任务和剩余时间
let tasks = [];
let totalAvailableTime = 0;  // 总可用时长
let remainingTime = 0;      // 剩余时长

// 显示全屏提示框
document.getElementById('fullscreen-prompt').style.display = 'block';

document.getElementById('confirm-button').addEventListener('click', function() {
    this.parentElement.style.display = 'none'; // 隐藏提示框
});

// 监听 F11 键
document.addEventListener('keydown', function(event) {
    if (event.key === 'F11') {
        enterFullScreen();
    }
});

function enterFullScreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

document.getElementById('pomodoro-button').addEventListener('click', function() {
    if (isPomodoroActive) {
        clearInterval(pomodoroInterval);
        isPomodoroActive = false;
        this.textContent = "开始";
        this.style.backgroundColor = "#4CAF50"; // 绿色
    } else {
        totalPomodoros++;
        startPomodoro();
        this.textContent = "暂停";
        this.style.backgroundColor = "#f44336"; // 红色
    }
});

function startPomodoro() {
    isPomodoroActive = true;
    pomodoroInterval = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(pomodoroInterval);
            isBreakTime = true;
            alert("25分钟专注完成！请休息5分钟。");
            timeLeft = 300; // 5分钟
            startBreak();
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function startBreak() {
    pomodoroInterval = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(pomodoroInterval);
            if (confirm("是否需要再次开启番茄钟？")) {
                timeLeft = 1500; // 重新设置为25分钟
                startPomodoro();
            } else {
                isPomodoroActive = false;
                document.getElementById('pomodoro-button').textContent = "开始";
                document.getElementById('pomodoro-button').style.backgroundColor = "#4CAF50"; // 绿色
            }
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 桌布替换功能
document.getElementById('change-background-button').addEventListener('click', function() {
    document.getElementById('background-upload').click(); // 触发文件选择
});

document.getElementById('background-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            localStorage.setItem('backgroundImage', e.target.result); // 保存到本地存储
        };
        reader.readAsDataURL(file);
    }
});

// 页面加载时检查本地存储并设置背景
window.onload = function() {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        document.body.style.backgroundImage = `url(${savedBackground})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }
    loadUrlsFromLocalStorage();
    loadAppsFromLocalStorage(); // 加载软件
};

document.getElementById('reset-button').addEventListener('click', function() {
    clearInterval(pomodoroInterval);
    isPomodoroActive = false;
    timeLeft = 1500; // 重置为25分钟
    updateTimerDisplay();
    document.getElementById('pomodoro-button').textContent = "开始";
    document.getElementById('pomodoro-button').style.backgroundColor = "#f44336"; // 红色
});

// 显示添加网址的弹出窗口
document.getElementById('add-url-button').addEventListener('click', function() {
    document.getElementById('url-modal').style.display = 'block';
});

// 关闭弹出窗口
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('url-modal').style.display = 'none';
});

// 保存网址
document.getElementById('save-url-button').addEventListener('click', function() {
    const url = document.getElementById('url-input').value.trim();
    const shortcut = document.getElementById('shortcut-input').value.trim();
    if (url && shortcut) {
        addUrlToList(url, shortcut);
        saveUrlToLocalStorage(url, shortcut); // 保存到 localStorage
        document.getElementById('url-input').value = ''; // 清空输入框
        document.getElementById('shortcut-input').value = ''; // 清空输入框
    }
});

// 添加网址到列表
function addUrlToList(url, shortcut) {
    const urlList = document.getElementById('url-list');
    const li = document.createElement('li');
    li.textContent = shortcut;

    const openButton = document.createElement('button');
    openButton.textContent = '打开';
    openButton.onclick = () => window.open(url, '_blank'); // 打开网址

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.onclick = () => {
        urlList.removeChild(li); // 删除网址
        removeUrlFromLocalStorage(shortcut); // 从 localStorage 中删除
    };

    li.appendChild(openButton);
    li.appendChild(deleteButton);
    urlList.appendChild(li);
}

// 保存网址到 localStorage
function saveUrlToLocalStorage(url, shortcut) {
    const urls = JSON.parse(localStorage.getItem('urls')) || [];
    urls.push({ url, shortcut });
    localStorage.setItem('urls', JSON.stringify(urls));
}

// 从 localStorage 中加载网址
function loadUrlsFromLocalStorage() {
    const urls = JSON.parse(localStorage.getItem('urls')) || [];
    urls.forEach(item => {
        addUrlToList(item.url, item.shortcut);
    });
}

// 从 localStorage 中删除网址
function removeUrlFromLocalStorage(shortcut) {
    const urls = JSON.parse(localStorage.getItem('urls')) || [];
    const updatedUrls = urls.filter(item => item.shortcut !== shortcut);
    localStorage.setItem('urls', JSON.stringify(updatedUrls));
}

// 显示添加软件的弹出窗口
// document.getElementById('add-app-button').addEventListener('click', function() {
//     document.getElementById('app-modal').style.display = 'block';
// });

// 关闭弹出窗口
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        this.parentElement.parentElement.style.display = 'none'; // 隐藏对应的弹出窗口
    });
});

// 添加软件到列表
function addAppToList(appPath, appShortcut) {
    const appList = document.getElementById('app-list');
    const li = document.createElement('li');
    li.textContent = appShortcut;

    const openButton = document.createElement('button');
    openButton.textContent = '打开';
    openButton.onclick = () => {
        // 使用 file:// 协议打开本地软件
        const filePath = appPath.startsWith('file://') ? appPath : `file://${appPath}`;
        window.open(filePath); 
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.onclick = () => {
        appList.removeChild(li); // 删除软件
        removeAppFromLocalStorage(appShortcut); // 从 localStorage 中删除
    };

    li.appendChild(openButton);
    li.appendChild(deleteButton);
    appList.appendChild(li);
}

// 保存软件到 localStorage
function saveAppToLocalStorage(appPath, appShortcut) {
    const apps = JSON.parse(localStorage.getItem('apps')) || [];
    apps.push({ appPath, appShortcut });
    localStorage.setItem('apps', JSON.stringify(apps));
}

// 从 localStorage 中加载软件
function loadAppsFromLocalStorage() {
    const apps = JSON.parse(localStorage.getItem('apps')) || [];
    apps.forEach(item => {
        addAppToList(item.appPath, item.appShortcut);
    });
}

// 从 localStorage 中删除软件
function removeAppFromLocalStorage(appShortcut) {
    const apps = JSON.parse(localStorage.getItem('apps')) || [];
    const updatedApps = apps.filter(item => item.appShortcut !== appShortcut);
    localStorage.setItem('apps', JSON.stringify(updatedApps));
}

// 任务栏折叠功能
document.getElementById('collapse-button').addEventListener('click', function() {
    const taskbar = document.getElementById('taskbar');
    taskbar.classList.toggle('collapsed');
    
    // 保存折叠状态到 localStorage
    localStorage.setItem('taskbarCollapsed', taskbar.classList.contains('collapsed'));
});

// 页面加载时恢复折叠状态
window.addEventListener('load', function() {
    const taskbar = document.getElementById('taskbar');
    const isCollapsed = localStorage.getItem('taskbarCollapsed') === 'true';
    if (isCollapsed) {
        taskbar.classList.add('collapsed');
    }
});

// 拖动功能
let isDragging = false;
let offsetX, offsetY;

const remainingTimeDisplay = document.getElementById('remaining-time-display');

remainingTimeDisplay.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - remainingTimeDisplay.getBoundingClientRect().left;
    offsetY = e.clientY - remainingTimeDisplay.getBoundingClientRect().top;
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        remainingTimeDisplay.style.left = (e.clientX - offsetX) + 'px';
        remainingTimeDisplay.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// 修改可用时长输入处理
document.getElementById('available-time').addEventListener('input', function() {
    const availableTime = parseInt(this.value) || 0;
    totalAvailableTime = availableTime;
    remainingTime = availableTime;
    
    // 重新计算剩余时间（考虑已有任务）
    const totalTaskTime = tasks.reduce((sum, task) => sum + task.time, 0);
    remainingTime = availableTime - totalTaskTime;
    
    // 更新统计
    updateStatistics();
    
    // 显示统计边栏
    const statisticsSidebar = document.getElementById('statistics-sidebar');
    if (statisticsSidebar) {
        statisticsSidebar.style.display = 'flex';
    }
});

// 更新剩余时间的函数
function updateRemainingTime() {
    if (totalAvailableTime <= 0) return; // 如果没有设置可用时间，直接返回
    
    // 计算所有任务的总时长
    const totalTaskTime = tasks.reduce((sum, task) => sum + task.time, 0);
    // 计算剩余时间
    remainingTime = totalAvailableTime - totalTaskTime;
    
    // 更新主显示
    const remainingTimeValue = document.getElementById('remaining-time-value');
    if (remainingTimeValue) {
        remainingTimeValue.textContent = remainingTime;
        remainingTimeValue.style.color = remainingTime < 0 ? '#ff4444' : '#4CAF50';
    }
    
    // 更新统计面板中的显示
    const remainingTimeStats = document.getElementById('remaining-time-stats');
    if (remainingTimeStats) {
        remainingTimeStats.textContent = remainingTime;
    }
    
    // 确保剩余时间显示是可见的
    const remainingTimeDisplay = document.getElementById('remaining-time');
    if (remainingTimeDisplay) {
        remainingTimeDisplay.style.display = 'block';
    }
}

// 修改添加任务的函数
document.getElementById('add-task-button').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input');
    const taskTimeInput = document.getElementById('task-time');
    
    const taskName = taskInput.value.trim();
    const taskTime = parseInt(taskTimeInput.value) || 0;

    if (!taskName || taskTime <= 0) {
        alert('请输入有效的任务名称和时间！');
        return;
    }

    // 检查是否超出可用时间
    if (remainingTime - taskTime < 0) {
        if (!confirm('添加此任务将超出可用时长，是否继续？')) {
            return;
        }
    }

    // 创建任务对象
    const task = {
        id: Date.now(),
        text: taskName,
        time: taskTime,
        completed: false
    };

    // 添加任务到数组
    tasks.push(task);

    // 更新剩余时间（在渲染任务之前）
    updateRemainingTime();

    // 渲染任务
    renderTask(task);

    // 更新统计数据
    updateStatistics();

    // 清空输入框
    taskInput.value = '';
    taskTimeInput.value = '';
});

// 渲染任务到列表
function renderTask(task, isSubtask = false) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    
    li.innerHTML = `
        <div class="task-info">
            <div class="task-name">${task.text}</div>
            <div class="task-time">预计用时：${task.time} 分钟</div>
        </div>
        <div class="task-actions">
            ${isSubtask ? '' : '<button class="ai-analyze-button">AI拆解</button>'}
            <button class="complete-task">完成</button>
            <button class="delete-task">删除</button>
        </div>
        <div class="subtasks" id="subtasks-${task.id}"></div>
    `;

    // 设置任务 ID
    li.dataset.id = task.id;
    
    // 绑定 AI 分析按钮事件（如果不是子任务）
    if (!isSubtask) {
        const aiButton = li.querySelector('.ai-analyze-button');
        aiButton.addEventListener('click', () => {
            showAIModal(task);
        });
    }
    
    // 绑定完成按钮事件
    const completeButton = li.querySelector('.complete-task');
    completeButton.addEventListener('click', () => {
        task.completed = !task.completed;
        li.classList.toggle('completed');
        completeButton.textContent = task.completed ? '取消完成' : '完成';
        updateStatistics();
    });
    
    // 绑定删除按钮事件
    const deleteButton = li.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
        deleteTask(task.id);
    });

    taskList.appendChild(li);
}

// 页面加载时加载任务
window.addEventListener('load', function() {
    // 不再加载任务
});

// 添加到现有的样式中
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
#statistics-sidebar {
    transition: transform 0.3s ease-in-out;
    transform: translateX(-100%);
}

#statistics-sidebar.visible {
    transform: translateX(0);
}

#statistics-sidebar.collapsed {
    transform: translateX(calc(-100% + 30px));
}
`;
document.head.appendChild(additionalStyle);

// 修改数据统计按钮的点击事件
document.getElementById('data-statistics-button').addEventListener('click', function() {
    const statisticsSidebar = document.getElementById('statistics-sidebar');
    
    // 切换可见性类
    statisticsSidebar.classList.toggle('visible');
    
    // 如果边栏变为可见，则更新统计数据
    if (statisticsSidebar.classList.contains('visible')) {
        statisticsSidebar.style.display = 'flex';
        statisticsSidebar.classList.remove('collapsed');
        updateStatistics();
    } else {
        // 如果隐藏，添加一个延迟，等动画完成后再隐藏元素
        setTimeout(() => {
            if (!statisticsSidebar.classList.contains('visible')) {
                statisticsSidebar.style.display = 'none';
            }
        }, 300); // 与过渡时间相同
    }
});

// 统计边栏折叠功能
document.getElementById('statistics-collapse-button').addEventListener('click', function() {
    const statisticsSidebar = document.getElementById('statistics-sidebar');
    statisticsSidebar.classList.toggle('collapsed');
    
    // 保存折叠状态到 localStorage
    localStorage.setItem('statisticsSidebarCollapsed', statisticsSidebar.classList.contains('collapsed'));
});

// 页面加载时恢复统计边栏的折叠状态
window.addEventListener('load', function() {
    const statisticsSidebar = document.getElementById('statistics-sidebar');
    const isCollapsed = localStorage.getItem('statisticsSidebarCollapsed') === 'true';
    if (isCollapsed) {
        statisticsSidebar.classList.add('collapsed');
    }
});

// 更新统计数据
function updateStatistics() {
    const completedTasks = tasks.filter(task => task.completed);
    const completedCount = completedTasks.length;
    
    // 更新任务计数
    document.getElementById('completed-tasks-count').textContent = completedCount;
    
    // 更新时间统计
    document.getElementById('total-available-time').textContent = totalAvailableTime;
    document.getElementById('remaining-time-stats').textContent = remainingTime;

    // 显示统计边栏
    const statisticsSidebar = document.getElementById('statistics-sidebar');
    if (statisticsSidebar) {
        statisticsSidebar.style.display = 'flex';
    }

    // 更新已完成任务列表
    const completedTasksList = document.getElementById('completed-tasks-list');
    completedTasksList.innerHTML = '';
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.text} (${task.time}分钟)`;
        completedTasksList.appendChild(li);
    });

    // 计算时间分配
    const completedTime = completedTasks.reduce((sum, task) => sum + task.time, 0);
    const uncompletedTasks = tasks.filter(task => !task.completed);
    const uncompletedTime = uncompletedTasks.reduce((sum, task) => sum + task.time, 0);

    // 更新饼图
    updateTimeDistributionChart(completedTime, uncompletedTime, remainingTime);
}

// 创建和更新饼图
function updateTimeDistributionChart(completedTime, uncompletedTime, remainingTime) {
    const ctx = document.getElementById('time-distribution-chart').getContext('2d');
    
    // 如果已经存在图表，先销毁它
    if (window.timeDistributionChart) {
        window.timeDistributionChart.destroy();
    }

    // 计算百分比
    const total = totalAvailableTime || 1; // 防止除以0
    const completedPercentage = (completedTime / total * 100).toFixed(1);
    const uncompletedPercentage = (uncompletedTime / total * 100).toFixed(1);
    const remainingPercentage = (remainingTime / total * 100).toFixed(1);

    // 创建新的饼图
    window.timeDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                `已完成任务 (${completedPercentage}%)`,
                `未完成任务 (${uncompletedPercentage}%)`,
                `剩余时间 (${remainingPercentage}%)`
            ],
            datasets: [{
                data: [completedTime, uncompletedTime, remainingTime],
                backgroundColor: ['#4CAF50', '#FF6384', '#36A2EB'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// AI 相关功能
function showAIModal(task) {
    const modal = document.getElementById('ai-modal');
    const currentTaskName = document.getElementById('current-task-name');
    const currentTaskTime = document.getElementById('current-task-time');
    
    currentTaskName.textContent = task.text;
    currentTaskTime.textContent = `预计用时：${task.time} 分钟`;
    
    modal.style.display = 'block';
    
    // 直接调用 showAIAnalysis
    showAIAnalysis(task.text, task.time);
}

// 修改 AI 建议获取函数
async function getTaskAdvice(taskName, estimatedTime) {
    try {
        console.log('Sending request with data:', {
            task_name: taskName,
            estimated_time: estimatedTime
        });
        
        const currentOrigin = window.location.origin;
        const API_BASE_URL = currentOrigin.includes('5500') 
            ? 'http://localhost:5000' 
            : currentOrigin;
            
        const url = `${API_BASE_URL}/api/get_task_advice`;
        console.log('Sending request to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task_name: taskName,
                estimated_time: estimatedTime
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let adviceText = '';

        while (true) {
            const {value, done} = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(5));
                        if (data.error) {
                            console.error('AI 服务错误:', data.error);
                            return {
                                advice: `分析出错：${data.error}`,
                                subtasks: []
                            };
                        }
                        if (data.content) {
                            adviceText += data.content;
                            // 实时更新 AI 响应显示，分开渲染建议和子任务
                            const aiResponse = document.getElementById('ai-response');
                            const subtasksList = document.getElementById('subtasks-list');
                            
                            // 分离建议和子任务部分
                            const parts = adviceText.split('[子任务开始]');
                            if (parts.length > 0) {
                                // 渲染建议部分，使用 marked 并保持格式
                                const adviceHtml = marked.parse(parts[0]);
                                aiResponse.innerHTML = `
                                    <div class="ai-advice">
                                        ${adviceHtml}
                                    </div>
                                `;
                                
                                // 如果有子任务部分，解析并显示
                                if (parts.length > 1) {
                                    const subtasksText = parts[1].split('[子任务结束]')[0];
                                    parseAndDisplaySubtasks(subtasksText, subtasksList);
                                }
                            }
                        }
                    } catch (e) {
                        console.error('解析响应数据失败:', e);
                    }
                }
            }
        }

        return {
            advice: adviceText,
            subtasks: []  // 子任务已经通过实时解析显示
        };
    } catch (error) {
        console.error('Error details:', error);
        return {
            advice: '抱歉，获取AI建议时出现错误。请稍后重试。',
            subtasks: []
        };
    }
}

// 在显示AI模态框时调用此函数
async function showAIAnalysis(taskName, estimatedTime) {
    const aiModal = document.getElementById('ai-modal');
    const aiResponse = document.getElementById('ai-response');
    const currentTaskName = document.getElementById('current-task-name');
    const currentTaskTime = document.getElementById('current-task-time');
    const subtasksList = document.getElementById('subtasks-list');

    // 显示加载状态
    aiResponse.innerHTML = '正在分析任务，请稍候...';
    aiModal.style.display = 'block';
    
    currentTaskName.textContent = `任务名称：${taskName}`;
    currentTaskTime.textContent = `预计用时：${estimatedTime}分钟`;

    try {
        // 获取AI建议，但不再重新渲染内容
        await getTaskAdvice(taskName, estimatedTime);
    } catch (error) {
        aiResponse.innerHTML = '获取AI建议失败，请稍后重试。';
    }
}

// 确保 marked 库已正确加载
if (typeof marked === 'undefined') {
    console.error('marked 库未加载，请检查 script 引用');
}

function parseAndDisplaySubtasks(subtasksText, subtasksList) {
    // 清空现有子任务列表
    subtasksList.innerHTML = '';
    
    // 按破折号分割子任务
    const subtasks = subtasksText.split('\n-').filter(task => task.trim());
    
    // 添加"全部添加到任务栏"按钮
    const addAllButton = document.createElement('button');
    addAllButton.className = 'add-all-subtasks-button';
    addAllButton.textContent = '全部添加到任务栏';
    addAllButton.style.margin = '0 0 15px 0';
    addAllButton.style.padding = '8px 15px';
    addAllButton.style.backgroundColor = '#4CAF50';
    addAllButton.style.color = 'white';
    addAllButton.style.border = 'none';
    addAllButton.style.borderRadius = '4px';
    addAllButton.style.cursor = 'pointer';
    
    addAllButton.addEventListener('click', () => {
        // 获取当前任务信息
        const currentTaskName = document.getElementById('current-task-name').textContent.replace('任务名称：', '').trim();
        
        // 删除原任务
        const originalTask = tasks.find(t => t.text === currentTaskName);
        if (originalTask) {
            deleteTask(originalTask.id);
        }
        
        // 添加所有子任务
        subtasks.forEach(subtask => {
            const nameMatch = subtask.match(/任务名称:\s*(.+?)(?=\n|$)/);
            const timeMatch = subtask.match(/预计时间:\s*(\d+)分钟/);
            
            if (nameMatch && timeMatch) {
                const taskName = nameMatch[1].trim();
                const taskTime = parseInt(timeMatch[1]);
                
                // 创建任务对象
                const task = {
                    id: Date.now() + Math.random(),
                    text: taskName,
                    time: taskTime,
                    completed: false,
                    isSubtask: true  // 标记为子任务
                };
                
                // 添加任务到数组
                tasks.push(task);
                
                // 渲染任务，传入 true 表示这是子任务
                renderTask(task, true);
            }
        });
        
        // 更新剩余时间和统计数据
        updateRemainingTime();
        updateStatistics();
        
        // 关闭模态框
        document.getElementById('ai-modal').style.display = 'none';
    });
    
    subtasksList.appendChild(addAllButton);
    
    // 处理每个子任务
    subtasks.forEach(subtask => {
        const li = document.createElement('li');
        li.className = 'subtask-item';
        
        // 解析子任务信息
        const nameMatch = subtask.match(/任务名称:\s*(.+?)(?=\n|$)/);
        const timeMatch = subtask.match(/预计时间:\s*(\d+)分钟/);
        const priorityMatch = subtask.match(/优先级:\s*(高|中|低)/);
        const descMatch = subtask.match(/描述:\s*(.+?)(?=\n|$)/);
        
        if (nameMatch) {
            const priorityClass = priorityMatch ? 
                `priority-${priorityMatch[1] === '高' ? 'high' : priorityMatch[1] === '中' ? 'medium' : 'low'}` : '';
            
            // 添加子任务内容
            li.innerHTML = `
                <div class="subtask-header">
                    <span class="subtask-name">${nameMatch[1].trim()}</span>
                    <span class="subtask-priority ${priorityClass}">${priorityMatch ? priorityMatch[1] : ''}</span>
                </div>
                <div class="subtask-details">
                    ${timeMatch ? `<div class="subtask-time">⏱️ ${timeMatch[1]}分钟</div>` : ''}
                    ${descMatch ? `<div class="subtask-desc">📝 ${descMatch[1].trim()}</div>` : ''}
                </div>
                <div class="subtask-actions">
                    <button class="add-subtask-button">添加到任务栏</button>
                </div>
            `;
            
            // 添加"添加到任务栏"按钮事件
            const addButton = li.querySelector('.add-subtask-button');
            addButton.addEventListener('click', () => {
                if (nameMatch && timeMatch) {
                    const taskName = nameMatch[1].trim();
                    const taskTime = parseInt(timeMatch[1]);
                    
                    // 创建任务对象
                    const task = {
                        id: Date.now() + Math.random(),
                        text: taskName,
                        time: taskTime,
                        completed: false,
                        isSubtask: true  // 标记为子任务
                    };
                    
                    // 添加任务到数组
                    tasks.push(task);
                    
                    // 渲染任务，传入 true 表示这是子任务
                    renderTask(task, true);
                    
                    // 更新剩余时间和统计数据
                    updateRemainingTime();
                    updateStatistics();
                    
                    // 提示用户
                    addButton.textContent = '已添加';
                    addButton.disabled = true;
                    addButton.style.backgroundColor = '#ccc';
                    
                    setTimeout(() => {
                        addButton.textContent = '添加到任务栏';
                        addButton.disabled = false;
                        addButton.style.backgroundColor = '';
                    }, 2000);
                }
            });
            
            subtasksList.appendChild(li);
        }
    });
}

// 绑定关闭按钮事件
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('ai-modal').style.display = 'none';
});

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('ai-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 修改 AI 按钮点击事件
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ai-analyze-button')) {
        const taskElement = e.target.closest('li');
        const taskId = taskElement.dataset.id;
        const task = tasks.find(t => t.id === parseInt(taskId));
        if (task) {
            showAIModal(task);
        }
    }
});

// 修改删除任务的事件处理
function deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
        tasks = tasks.filter(t => t.id !== taskId);
        updateRemainingTime();
        updateStatistics();
    }
}

// 修改服务器状态检查函数
async function checkServerStatus() {
    try {
        const response = await fetch('http://localhost:5000/api/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            document.getElementById('server-status-overlay').style.display = 'none';
            return true;
        }
    } catch (error) {
        console.error('服务器未运行:', error);
        // 显示更友好的错误提示
        const overlay = document.getElementById('server-status-overlay');
        overlay.innerHTML = `
            <h2>服务器未启动</h2>
            <p>请按照以下步骤启动服务器：</p>
            <ol style="text-align: left; max-width: 600px;">
                <li>打开命令提示符或终端</li>
                <li>进入项目目录</li>
                <li>运行命令：<code style="background: #333; padding: 3px 6px; border-radius: 3px;">python app.py</code></li>
            </ol>
            <p>或者使用快捷方式：</p>
            <ol style="text-align: left; max-width: 600px;">
                <li>创建文本文件 <code>启动赛博学习桌.bat</code></li>
                <li>添加以下内容：</li>
                <pre style="background: #333; padding: 10px; border-radius: 5px; text-align: left;">@echo off
echo 正在启动赛博学习桌...
cd /d %~dp0
start python app.py
echo 服务器已启动，正在打开网页...
timeout /t 2
start http://127.0.0.1:5500/index.html</pre>
                <li>保存并双击运行</li>
            </ol>
            <button id="server-check-button" style="margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                重新检查服务器状态
            </button>
        `;
        
        // 重新绑定检查按钮事件
        document.getElementById('server-check-button').addEventListener('click', checkServerStatus);
        return false;
    }
    return false;
}

// 页面加载时检查服务器状态
window.addEventListener('load', async function() {
    // 显示加载状态
    const overlay = document.getElementById('server-status-overlay');
    overlay.style.display = 'flex';
    
    // 检查服务器状态
    await checkServerStatus();
}); 