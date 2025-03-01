# Cyber-Study-Desk-V4
赛博学习桌是一个结合番茄钟、任务管理、数据统计和自定义桌布等功能的应用，旨在帮助用户提高专注度和管理任务。它支持全屏模式，提供了方便的任务栏和统计功能，可以帮助用户更加专注地学习和工作。

## 主要功能

### 番茄钟功能
- 使用番茄工作法进行时间管理，每次专注工作25分钟后休息5分钟。
- 支持开始、暂停和重置番茄钟。

### 任务管理
- 用户可以输入每日可用时间，添加任务并设置每个任务的预计时间。
- 使用AI助手将大任务拆解为小任务，由用户自行决定是否接受AI的建议，有助于提高任务完成率。
- 支持查看、删除和标记任务完成状态。
- 自动更新剩余可用时间，确保不会安排过多任务。

### 数据统计
- 提供任务完成情况、总可用时长和剩余时长的统计。
- 显示已完成任务的列表。
- 使用饼图展示时间分配，包括已完成任务、未完成任务和剩余时间。

### 自定义桌布
- 用户可以通过上传图片来更换桌面背景。

### 网址栏
- 允许用户添加常用的网址，并设置快捷方式。
- 支持打开和删除网址。

### 软件管理（尚未完全启用）
- 允许用户添加本地应用，并可通过快捷方式打开。

### 任务栏与边栏
- 任务栏可以折叠或展开，便于用户查看任务列表和管理时间。
- 数据统计边栏可以折叠，显示图表和任务完成情况。

---

## 安装

1. **克隆项目到本地**：
   git clone https://github.com/your-username/cyber-study-desk.git
   
- 如果克隆失败，请检查链接的合法性或稍后重试。
### 启动应用：
- 打开 index.html 文件以启动应用：open index.html
- 或者通过浏览器直接访问。
### 技术栈
- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js (用于数据可视化)
- LocalStorage (用于数据存储)
### 贡献
如果你有任何建议或改进，可以提起 Issue 或者直接提交 Pull Request。

## 快速开始

### 方法一：使用快捷启动脚本（推荐）

1. 在项目根目录创建 `启动赛博学习桌.bat` 文件
2. 将以下内容复制到文件中：
   ```batch
   @echo off
   echo 正在启动赛博学习桌...
   cd /d %~dp0
   start python app.py
   echo 服务器已启动，正在打开网页...
   timeout /t 2
   start http://127.0.0.1:5500/index.html
   ```
3. 双击运行 `启动赛博学习桌.bat` 即可启动应用

### 方法二：手动启动

1. 安装依赖：
   ```bash
   pip install flask flask-cors openai python-dotenv
   ```

2. 配置环境变量：
   - 创建 `.env` 文件
   - 添加 OpenAI API 密钥：
     ```
     OPENAI_API_KEY=你的API密钥
     ```

3. 启动服务器：
   ```bash
   python app.py
   ```

4. 使用 Live Server 或其他方式启动前端页面

## 使用说明

1. **任务管理**
   - 添加任务并设置预计用时
   - 使用 AI 分析功能拆解复杂任务
   - 完成任务后标记或删除

2. **番茄钟**
   - 点击开始按钮启动 25 分钟专注时间
   - 完成后自动提示 5 分钟休息
   - 可随时暂停或重置

3. **数据统计**
   - 查看任务完成情况
   - 时间分配可视化
   - 剩余时间统计

4. **个性化设置**
   - 更换桌面背景
   - 管理常用网址
   - 自定义任务栏位置

## 注意事项

- 首次启动时需要确保 Python 环境已正确配置
- 服务器默认运行在 `http://localhost:5000`
- 前端页面默认运行在 `http://127.0.0.1:5500`
- 如果遇到服务器未启动的提示，请按照界面提示进行操作

## 技术栈

- 前端：HTML, CSS, JavaScript
- 后端：Flask
- AI 服务：OpenAI API
- 数据可视化：Chart.js

## 贡献

欢迎提交 Issue 和 Pull Request
