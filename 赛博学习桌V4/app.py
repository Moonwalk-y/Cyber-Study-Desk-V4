from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import os
import json

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://127.0.0.1:5500", "http://localhost:5500"],
        "methods": ["POST", "GET", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# 配置 OpenAI
client = openai.OpenAI(
    base_url="https://yunwu.ai/v1",
    api_key=os.getenv("OPENAI_API_KEY")
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/get_task_advice', methods=['POST', 'OPTIONS'])
def get_task_advice():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    try:
        data = request.get_json()
        task_name = data.get('task_name')
        estimated_time = data.get('estimated_time')

        if not task_name or not estimated_time:
            return jsonify({'error': '缺少必要参数'}), 400

        def generate():
            try:
                # 创建流式响应
                stream = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": """你是一个专业的任务管理顾问。
                        请按照以下格式分析并分解任务：

                        1. 首先给出对任务的整体分析和建议，包括时间分配的合理性

                        2. 然后提供子任务分解：

                        [子任务开始]
                        - 任务名称: 子任务1
                          预计时间: XX分钟（注意总时间不超过限制）
                          优先级: 高/中/低
                          描述: 具体可执行的步骤...

                        - 任务名称: 子任务2
                          预计时间: XX分钟
                          优先级: 高/中/低
                          描述: 具体可执行的步骤...
                        [子任务结束]"""},
                        {"role": "user", "content": f"分析任务「{task_name}」，预计用时{estimated_time}分钟，请给出建议和子任务分解。"}
                    ],
                    stream=True,
                    temperature=0.7,
                    max_tokens=2000
                )

                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        yield f"data: {json.dumps({'content': content})}\n\n"

            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        response = Response(stream_with_context(generate()), mimetype='text/event-stream')
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin'))
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    except Exception as e:
        print(f"Error in get_task_advice: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['POST'])
def test():
    return jsonify({'message': 'Test successful'})

if __name__ == '__main__':
    app.run(debug=True) 